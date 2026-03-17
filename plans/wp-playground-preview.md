# WordPress Playground live preview

Story: story-860
Agent: architect

## Context

Embed WordPress Playground in an iframe to give users a live preview of their generated theme running on a real WordPress instance — entirely in the browser via WebAssembly. No server-side WordPress needed.

WordPress Playground (from research):
- Runs PHP via WebAssembly (php-wasm), SQLite instead of MySQL
- Blueprint JSON format supports `installTheme` from a zip URL/blob
- `@wp-playground/client` npm package for programmatic control

## What changes

| File | Change |
|---|---|
| src/components/WpPlayground.tsx | React component that embeds WordPress Playground in an iframe, accepts a ZIP blob, installs and activates the theme via Blueprint |

## Contract

- `WpPlayground` component — props: `{ themeZip: Blob, themeName: string, onReady?: () => void, onError?: (error: Error) => void }`
- Internal: creates object URL from blob, constructs Blueprint, initializes Playground client

## Tasks

1. Install `@wp-playground/client` (already in story-851 deps)
2. Implement `WpPlayground.tsx`:
   - Accept `themeZip` blob prop and `themeName` string prop
   - Create a blob URL from the ZIP: `URL.createObjectURL(themeZip)`
   - Construct Blueprint JSON:
     ```json
     {
       "landingPage": "/",
       "steps": [
         {
           "step": "installTheme",
           "themeData": { "resource": "url", "url": "<blob-url>" },
           "options": { "activate": true }
         }
       ]
     }
     ```
   - Use `startPlaygroundWeb()` or iframe approach to load Playground with the Blueprint
   - Show a loading state while Playground initializes
   - Handle errors gracefully (Playground fails to load, theme install fails)
3. Add responsive iframe sizing:
   - Desktop: fixed height 600px, full width
   - Tablet controls: buttons to toggle viewport size (desktop/tablet/mobile preview widths)
   - Mobile: 100% width, 400px height
4. Add "Open in new tab" button that opens the Playground URL in a new window for full-screen preview

## Acceptance criteria

- Given a valid theme ZIP blob, when WpPlayground mounts, then WordPress Playground loads and displays the theme
- Given Playground has loaded, when the theme is installed, then the front page renders with the generated theme's styles and layout
- Given viewport toggle buttons, when "mobile" is clicked, then the iframe width changes to 375px
- Given an error during loading, when Playground fails, then an error message is shown (not a blank iframe)

## Verification

- Manual test: generate a theme, verify it renders in the Playground preview
- Manual test: toggle viewport sizes, verify responsive behavior
