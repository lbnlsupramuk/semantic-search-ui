const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const limitInput = document.querySelector("#limit");
const searchButton = document.querySelector("#search-button");
const searchPanel = document.querySelector(".search-panel");
const voiceButton = document.querySelector("#voice-button");
const voiceButtonLabel = voiceButton.querySelector(".voice-button-label");
const voiceHelp = document.querySelector("#voice-help");
const statusBox = document.querySelector("#status");
const summary = document.querySelector("#summary");
const resultsSection = document.querySelector("#results-section");
const detailsSection = document.querySelector("#details-section");
const resultsContainer = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");
const modelName = document.querySelector("#model-name");
const totalTime = document.querySelector("#total-time");
const queryPlan = document.querySelector("#query-plan");
const diagnostics = document.querySelector("#diagnostics");
const modelSummary = document.querySelector("#model-summary");
const resultsHeading = document.querySelector("#results-heading");

const queryPlanDetails = queryPlan.closest("details");
const diagnosticsDetails = diagnostics.closest("details");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let voiceBaseQuery = "";

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = navigator.language || "en-US";

  recognition.addEventListener("start", () => {
    voiceButton.classList.add("is-listening");
    voiceButton.setAttribute("aria-pressed", "true");
    voiceButtonLabel.textContent = "Listening…";
    showStatus("Listening for your query…", "working");
  });

  recognition.addEventListener("result", (event) => {
    let transcript = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }

    queryInput.value = `${voiceBaseQuery}${transcript}`.trimStart();
  });

  recognition.addEventListener("error", (event) => {
    const messages = {
      "not-allowed": "Microphone access was denied. Allow microphone access and try again.",
      "no-speech": "No speech was detected. Try speaking again.",
      "audio-capture": "No microphone was detected.",
      network: "Speech recognition is unavailable because the browser service could not be reached.",
    };

    showStatus(
      messages[event.error] || "Speech recognition could not start.",
      "error",
    );
  });

  recognition.addEventListener("end", () => {
    voiceButton.classList.remove("is-listening");
    voiceButton.setAttribute("aria-pressed", "false");
    voiceButtonLabel.textContent = "Speak";
  });

  voiceButton.addEventListener("click", () => {
    if (voiceButton.classList.contains("is-listening")) {
      recognition.stop();
      return;
    }

    voiceBaseQuery = queryInput.value.trim();
    if (voiceBaseQuery) {
      voiceBaseQuery += " ";
    }

    queryInput.focus();
    recognition.start();
  });
} else {
  voiceButton.hidden = true;
  voiceHelp.textContent =
    "Voice input is not supported in this browser. You can type your query instead.";
}

for (const button of document.querySelectorAll(".example-query")) {
  button.addEventListener("click", () => {
    queryInput.value = button.dataset.query;
    queryInput.focus();
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = queryInput.value.trim();
  const limit = Number.parseInt(limitInput.value, 10);

  if (!query) {
    showStatus("Enter a query before searching.", "error");
    return;
  }

  setLoading(true);
  clearResults();
  searchPanel.classList.add("is-searching");
  showStatus("Running search…", "working");

  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit }),
    });

    const body = await parseResponseBody(response);

    if (!response.ok) {
      const detail = body?.detail ?? {};

      const message =
        detail.message ??
        `Search failed with status ${response.status}`;

      showStatus(message, "error");

      if (detail.query_plan) {
        queryPlan.textContent = JSON.stringify(
          detail.query_plan,
          null,
          2,
        );

        if (queryPlanDetails) {
          queryPlanDetails.classList.remove("hidden");
        }
      } else if (queryPlanDetails) {
        queryPlanDetails.classList.add("hidden");
      }

      if (detail.code || detail.query_plan) {
        const errorDiagnostics = {
          error_code: detail.code ?? null,
          error_message: message,
          search_executed: false,
        };

        if (
          detail.provider_status !== null &&
          detail.provider_status !== undefined
        ) {
          errorDiagnostics.provider_status =
            detail.provider_status;
        }

        if (
          detail.provider_error_code !== null &&
          detail.provider_error_code !== undefined
        ) {
          errorDiagnostics.provider_error_code =
            detail.provider_error_code;
        }

        if (
          detail.retryable !== null &&
          detail.retryable !== undefined
        ) {
          errorDiagnostics.retryable =
            detail.retryable;
        }

        diagnostics.textContent = JSON.stringify(
          errorDiagnostics,
          null,
          2,
        );

        if (diagnosticsDetails) {
          diagnosticsDetails.classList.remove("hidden");
        }

        detailsSection.classList.remove("hidden");
      }

      return;
    }

    if (!body) {
      throw new Error(
        "Search returned an empty response.",
      );
    }

    if (
      body.outcome === "clarification_required" ||
      body.outcome === "unsupported"
    ) {
      renderClarification(body);
      return;
    }

    renderResponse(body);

    showStatus(
      body.results.length
        ? `Returned ${body.results.length} result${body.results.length === 1 ? "" : "s"}.`
        : "The query completed successfully but returned no results.",
      body.results.length ? "success" : "notice",
    );
  } catch (error) {
    showStatus(
      error.message || "Search failed.",
      "error",
    );
  } finally {
    searchPanel.classList.remove("is-searching");
    setLoading(false);
  }
});

loadMetadata();

async function parseResponseBody(response) {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (
    !contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function setLoading(isLoading) {
  searchButton.disabled = isLoading;
  searchButton.textContent =
    isLoading ? "Searching…" : "Search";
}

function clearResults() {
  resultsContainer.replaceChildren();

  summary.classList.add("hidden");
  resultsSection.classList.add("hidden");
  detailsSection.classList.add("hidden");

  if (queryPlanDetails) {
    queryPlanDetails.classList.remove("hidden");
  }

  if (diagnosticsDetails) {
    diagnosticsDetails.classList.remove("hidden");
  }

  queryPlan.textContent = "";
  diagnostics.textContent = "";
}

function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}

function renderResponse(body) {
  resultsHeading.classList.remove("hidden");
  resultsHeading.textContent = "Results";

  resultCount.textContent =
    body.diagnostics.result_count;

  modelName.textContent =
    body.diagnostics.embedding_model || "Unknown";

  totalTime.textContent =
    `${body.timing_ms.total.toFixed(0)} ms`;

  queryPlan.textContent = JSON.stringify(
    body.query_plan,
    null,
    2,
  );

  if (queryPlanDetails) {
    queryPlanDetails.classList.remove("hidden");
  }

  diagnostics.textContent = JSON.stringify(
    {
      diagnostics: body.diagnostics,
      timing_ms: body.timing_ms,
    },
    null,
    2,
  );

  if (diagnosticsDetails) {
    diagnosticsDetails.classList.remove("hidden");
  }

  resultsContainer.replaceChildren();

  for (const [index, result] of body.results.entries()) {
    resultsContainer.appendChild(
      renderResult(
        result,
        index + 1,
      ),
    );
  }

  summary.classList.remove("hidden");
  detailsSection.classList.remove("hidden");

  if (body.results.length) {
    resultsSection.classList.remove("hidden");
  }
}

function renderClarification(body) {
  clearResults();

  const clarification = body.clarification;

  if (!clarification) {
    throw new Error(
      "Clarification response is missing.",
    );
  }

  const panel =
    document.createElement("section");

  panel.className =
    "clarification-panel";

  const heading =
    document.createElement("h2");

  heading.textContent =
    clarification.title;

  const message =
    document.createElement("p");

  message.textContent =
    clarification.message;

  panel.append(
    heading,
    message,
  );

  if (clarification.criteria.length) {
    const label =
      document.createElement("p");

    label.textContent =
      "Suggested criteria:";

    panel.appendChild(
      label,
    );

    const buttons =
      document.createElement("div");

    buttons.className =
      "clarification-options";

    for (
      const criterion
      of clarification.criteria
    ) {
      const button =
        document.createElement("button");

      button.type = "button";

      button.textContent =
        criterion.label;

      button.dataset.criterion =
        criterion.code;

      button.addEventListener(
        "click",
        () => {
          queryInput.value =
            `${body.query} Criterion: ${criterion.label}`;

          queryInput.focus();
        },
      );

      buttons.appendChild(
        button,
      );
    }

    panel.appendChild(
      buttons,
    );
  }

  resultsContainer.replaceChildren(
    panel,
  );

  resultsHeading.classList.add(
    "hidden",
  );

  resultsSection.classList.remove(
    "hidden",
  );

  queryPlan.textContent =
    JSON.stringify(
      body.query_plan,
      null,
      2,
    );

  if (queryPlanDetails) {
    queryPlanDetails.classList.remove("hidden");
  }

  diagnostics.textContent =
    JSON.stringify(
      {
        diagnostics: body.diagnostics,
        timing_ms: body.timing_ms,
      },
      null,
      2,
    );

  if (diagnosticsDetails) {
    diagnosticsDetails.classList.remove("hidden");
  }

  detailsSection.classList.remove(
    "hidden",
  );

  statusBox.classList.add(
    "hidden",
  );
}

function renderResult(
  result,
  rank,
) {
  const article =
    document.createElement("article");

  article.className =
    "result-card";

  const heading =
    document.createElement("div");

  heading.className =
    "result-heading";

  const title =
    document.createElement("h3");

  title.textContent =
    `${rank}. ${result.id}`;

  const distance =
    document.createElement("span");

  distance.className =
    "distance";

  distance.textContent =
    `Distance ${Number(result.distance).toFixed(4)}`;

  heading.append(
    title,
    distance,
  );

  const metadata =
    document.createElement("dl");

  metadata.className =
    "metadata-list";

  const preferredFields = [
    [
      "sample_collection_year",
      "Collection year",
    ],
    [
      "geographic_location",
      "Location",
    ],
    [
      "ecosystem",
      "Ecosystem",
    ],
    [
      "ecosystem_category",
      "Category",
    ],
    [
      "ecosystem_type",
      "Type",
    ],
    [
      "ecosystem_subtype",
      "Subtype",
    ],
    [
      "specific_ecosystem",
      "Specific ecosystem",
    ],
    [
      "habitat",
      "Habitat",
    ],
  ];

  for (
    const [key, label]
    of preferredFields
  ) {
    const value =
      result[key];

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      continue;
    }

    const term =
      document.createElement("dt");

    term.textContent =
      label;

    const description =
      document.createElement("dd");

    description.textContent =
      String(value);

    metadata.append(
      term,
      description,
    );
  }

  const details =
    document.createElement("details");

  details.className =
    "yaml-details";

  const detailsSummary =
    document.createElement("summary");

  detailsSummary.textContent =
    "View YAML";

  const yaml =
    document.createElement("pre");

  yaml.textContent =
    result.yaml;

  details.append(
    detailsSummary,
    yaml,
  );

  article.append(
    heading,
    metadata,
    details,
  );

  return article;
}

async function loadMetadata() {
  try {
    const response =
      await fetch(
        "/api/metadata",
      );

    if (!response.ok) {
      throw new Error();
    }

    const metadata =
      await parseResponseBody(
        response,
      );

    if (!metadata) {
      throw new Error();
    }

    modelSummary.textContent =
      `Planner: ${metadata.planner_model}   |   ` +
      `Embeddings: ${metadata.embedding_model} ` +
      `(${metadata.embedding_dimension} dimensions)`;
  } catch {
    modelSummary.textContent =
      "Model information unavailable.";
  }
}
