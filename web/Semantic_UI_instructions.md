Align the Web UI with JGI branding and style guidelines
Brief Summary
Update the semantic-search demonstration Web UI so its visual design, typography, navigation, colors, spacing, and general presentation are consistent with JGI branding and applicable JGI/LBNL Web style guidelines.
The current interface was developed primarily as a functional demonstration of semantic search, query interpretation, diagnostics, and semantic metadata inspection. It now includes several user-facing pages and is being used for demos and evaluation, making a more polished and institutionally consistent presentation appropriate.
This work should improve presentation without changing semantic-search behavior or turning the prototype into a full production Web application.
Is your feature request related to a problem?
Motivation
The current Web UI is intentionally lightweight and application-specific. Its visual design was developed incrementally while implementing:


        
      natural-language semantic search

        
      ranked result display

        
      subjective-query clarification

        
      query-plan inspection

        
      execution diagnostics

        
      semantic data dictionary inspection

        
      embedding catalog inspection

As the interface has expanded and is increasingly used for demonstrations, its appearance should be brought into line with JGI's visual identity and Web conventions.
The current UI should also present a consistent visual system across:


        
      the search page

        
      clarification responses

        
      result cards

        
      query diagnostics

        
      Semantic Data Dictionary

        
      Embedding Catalog

        
      navigation and supporting pages

The goal is not to redesign the semantic-search application architecture. The goal is to make the existing demonstration interface visually coherent, recognizable as a JGI application, and suitable for internal and external demonstrations.
Additional context:
Review Applicable JGI Guidelines
Before implementing visual changes, identify the current applicable JGI branding and Web style guidance.
Review available guidance for:


        
      JGI logo usage

        
      institutional identification

        
      approved colors

        
      typography

        
      navigation

        
      page structure

        
      links and buttons

        
      tables

        
      form controls

        
      accessibility

        
      responsive behavior

        
      footer/header requirements

        
      LBNL/DOE attribution where applicable

Where formal guidance is unavailable or does not address a particular component, follow the visual conventions used by current JGI Web properties rather than inventing an unrelated design system.
Document the sources or reference pages used for the redesign so later UI work can follow the same conventions.
Shared Application Layout
Create a consistent visual shell for all Web UI pages.
Current pages include:
/
/semantic-dictionary
/embedding-catalog
Common presentation should include, where appropriate:


        
      JGI branding/header

        
      application title

        
      primary navigation

        
      consistent content width and spacing

        
      footer/institutional attribution

        
      common typography

        
      common colors and component styling

Avoid duplicating substantial layout markup between templates where a shared Jinja base template or reusable partial is appropriate.
Navigation
Review and restyle the existing navigation:


        
      Search

        
      Semantic Dictionary

        
      Embedding Catalog

        
      API Docs

        
      Code

The navigation should:


        
      follow the selected JGI visual conventions

        
      clearly identify the current page

        
      remain usable at narrower viewport widths

        
      distinguish application navigation from external/developer links where useful

        
      retain access to API documentation and source code

The navigation should not become unnecessarily complex for the small number of pages in the prototype.
Search Interface
Restyle the main semantic-search interface while preserving its existing functionality.
Review presentation of:


        
      natural-language query input

        
      result-limit/page-size controls

        
      Search button

        
      example queries

        
      status messages

        
      summary metrics

        
      ranked results

        
      vector distance display

        
      YAML details

        
      query interpretation

        
      execution diagnostics

The natural-language query should remain the primary visual focus of the page.
Clarification Responses
Ensure subjective and unsupported-query responses fit naturally into the revised visual system.
Clarification panels should clearly communicate:


        
      why clarification is needed

        
      suggested measurable criteria

        
      available user actions

The current server-owned clarification text and behavior should remain unchanged unless a separate functional issue requires modification.
Semantic Metadata Pages
Apply the same design system to:


        
      /semantic-dictionary

        
      /embedding-catalog

The metadata pages contain wide, information-dense tables and should remain optimized for technical inspection.
Review:


        
      table headers

        
      row spacing

        
      hover/focus states

        
      badges for semantic/direct capabilities

        
      filters

        
      search controls

        
      monospace metadata

        
      horizontal overflow behavior

        
      wide-screen layout

Do not sacrifice table usability merely to force the metadata pages into the narrower content width appropriate for the search interface.
Color and Status Semantics
Use a consistent, accessible color system for:


        
      primary actions

        
      links

        
      informational notices

        
      success states

        
      warnings

        
      errors

        
      semantic-field badges

        
      direct-filter badges

Do not rely on color alone to communicate state.
Any JGI brand colors used for text or controls should meet appropriate contrast requirements.
Typography
Adopt typography consistent with applicable JGI guidance and current JGI Web properties.
Establish consistent styles for:


        
      page titles

        
      section headings

        
      body text

        
      form labels

        
      navigation

        
      tables

        
      result metadata

        
      code/YAML

        
      diagnostic output

Avoid introducing unnecessary font dependencies if system or approved Web fonts provide an adequate result.
Responsive Layout
The interface should remain usable on common desktop and laptop display sizes and degrade reasonably on smaller screens.
Review:


        
      navigation wrapping/collapse

        
      search controls

        
      result cards

        
      summary cards

        
      clarification buttons

        
      metadata filters

        
      metadata tables

Wide metadata tables may continue to use horizontal scrolling where that is more usable than aggressively compressing columns.
Accessibility
Include basic accessibility review as part of the visual update.
At minimum verify:


        
      sufficient text/background contrast

        
      visible keyboard focus states

        
      semantic heading hierarchy

        
      form labels remain associated with controls

        
      navigation is keyboard accessible

        
      buttons and links remain distinguishable

        
      status messages retain appropriate live-region behavior

        
      tables retain meaningful header markup

        
      the interface remains usable without relying solely on color

The goal is to avoid regressions and improve obvious issues; a formal accessibility certification is not required by this Feature.
CSS Organization
Review the current web/static/styles.css as part of the redesign.
As the interface has grown, establish reusable styles for common components rather than accumulating page-specific overrides.
Potential reusable concepts include:


        
      page shell

        
      site/application header

        
      navigation

        
      content sections

        
      forms

        
      buttons

        
      status/notice panels

        
      cards

        
      badges

        
      tables

        
      code/diagnostic blocks

Keep the implementation lightweight. Introducing a large frontend framework or CSS framework is not necessary unless there is a concrete requirement for one.
Template Reuse
Evaluate whether the current templates should share a Jinja base template.
For example:
base.html
    ├── search.html
    ├── semantic_dictionary.html
    └── embedding_catalog.html
A base template could own:


        
      document structure

        
      metadata

        
      stylesheet inclusion

        
      branding/header

        
      navigation

        
      footer

Individual pages would provide their page-specific content and JavaScript.
This should be implemented only where it reduces duplication and improves consistency.
Preserve Functional Behavior
The redesign should not change the semantic-search contracts.
Existing behavior should remain intact, including:


        
      search execution

        
      result rendering

        
      subjective-query clarification

        
      unsupported-query handling

        
      query-plan display

        
      execution diagnostics

        
      semantic dictionary filtering

        
      embedding catalog display

        
      API endpoints

Visual changes should remain separable from retrieval/planner behavior.
Acceptance Criteria


        
       Applicable JGI branding and Web style guidance is identified and documented.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       The semantic-search Web UI uses a consistent JGI-aligned visual design.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       JGI branding is incorporated in accordance with applicable usage guidelines.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Search, Semantic Dictionary, and Embedding Catalog pages share a consistent application layout.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Common template/layout markup is reused where appropriate.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Navigation is visually consistent and clearly indicates available application sections.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       The natural-language search interface remains the primary focus of the search page.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Search results use the revised visual system.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Clarification responses use the revised visual system.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Query-plan and execution-diagnostic displays remain usable.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Semantic Data Dictionary filters and tables remain usable.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Embedding Catalog tables remain usable.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Wide metadata tables retain appropriate horizontal-overflow behavior.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Buttons, links, forms, cards, notices, badges, and tables use consistent styling.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Success, notice, warning, and error states are visually distinguishable without relying solely on color.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Basic color-contrast and keyboard-focus behavior is reviewed.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Existing form labels, live regions, semantic headings, and table headers remain accessible.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       The layout behaves reasonably on common desktop/laptop widths and smaller viewports.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Existing Web UI functional tests continue to pass.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       Search and metadata behavior are unchanged by the visual redesign.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

        
       README screenshots or Web UI documentation are updated if applicable.   
        Task actions
            
      Convert to child item
     
      Disable list item
      Delete 

Out of Scope
This Feature does not require:


        
      changing semantic retrieval behavior

        
      changing the query planner

        
      changing the REST API contracts

        
      implementing search pagination

        
      implementing result-set relevance cutoffs

        
      redesigning the Semantic Data Dictionary

        
      adding metadata editing/administration

        
      introducing a full JavaScript frontend framework

        
      implementing user authentication

        
      reproducing the complete JGI production website

        
      formal accessibility certification

Functional Web UI enhancements should continue to be tracked separately from this visual-design work.