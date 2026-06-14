<script lang="ts">
  interface Props {
    onclose: () => void;
  }
  let { onclose }: Props = $props();

  const features = [
    { icon: "7️⃣", text: "Font Awesome v7 support" },
    { icon: "♥", text: "Favorites: heart any icon and filter by favorites" },
    { icon: "🕒", text: "Recent icons: last 20 icons you used, always at hand" },
    { icon: "✨", text: "New icons filter: browse icons added in recent FA releases" },
    { icon: "⌨", text: "Keyboard navigation: arrow keys to move, Enter to activate" },
    { icon: "📋", text: "More copy formats: HTML Tag, Vue Array, React JSX, SVG inline" },
    { icon: "✏", text: "Insert at cursor: paste directly into your active editor" },
    { icon: "🔡", text: "Icon size controls: A- / A+ buttons in the toolbar" },
  ];
</script>

<div class="overlay" role="presentation" onclick={onclose}></div>
<div class="modal" role="dialog" aria-modal="true" aria-label="What's New">
  <div class="modal-header">
    <div class="header-top">
      <span class="title">We're back 🎉</span>
      <span class="version-badge">v1.0.0</span>
    </div>
    <p class="subtitle">
      After 4 years, Font Awesome Gallery just got its biggest update ever —
      packed with new features, better performance, and support for FA v6 &amp; v7.
    </p>
  </div>
  <p class="section-label">What's new</p>
  <ul class="feature-list">
    {#each features as { icon, text }}
      <li>
        <span class="feature-icon" aria-hidden="true">{icon}</span>
        <span>{text}</span>
      </li>
    {/each}
  </ul>
  <div class="modal-footer">
    <p class="thanks">
      Thank you for 93k+ installs and your continued support —
      we hope this makes your workflow smoother than ever.
    </p>
    <button class="got-it-btn" onclick={onclose}>Let's go!</button>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 150;
    background: rgba(0, 0, 0, 0.45);
  }

  .modal {
    position: fixed;
    inset: 12px;
    z-index: 151;
    display: flex;
    flex-direction: column;
    background: var(--vscode-editorWidget-background, var(--vscode-editor-background));
    border: 1px solid var(--vscode-editorWidget-border, var(--vscode-panel-border));
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  }

  .modal-header {
    padding: 14px 14px 10px;
    border-bottom: 1px solid var(--vscode-editorWidget-border, var(--vscode-panel-border));
  }

  .header-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .title {
    font-size: 14px;
    font-weight: 700;
    color: var(--vscode-foreground);
  }

  .version-badge {
    font-size: 10px;
    padding: 1px 6px;
    background: var(--vscode-badge-background);
    color: var(--vscode-badge-foreground);
    border-radius: 10px;
  }

  .subtitle {
    margin: 0;
    font-size: 11px;
    line-height: 1.5;
    color: var(--vscode-descriptionForeground);
  }

  .section-label {
    margin: 0;
    padding: 8px 14px 4px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vscode-descriptionForeground);
  }

  .feature-list {
    list-style: none;
    margin: 0;
    padding: 0 14px 10px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .feature-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 11.5px;
    color: var(--vscode-foreground);
    line-height: 1.4;
  }

  .feature-icon {
    flex-shrink: 0;
    width: 16px;
    text-align: center;
  }

  .modal-footer {
    padding: 10px 14px 12px;
    border-top: 1px solid var(--vscode-editorWidget-border, var(--vscode-panel-border));
  }

  .thanks {
    margin: 0 0 10px;
    font-size: 11px;
    line-height: 1.5;
    color: var(--vscode-descriptionForeground);
  }

  .got-it-btn {
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
    border: none;
    border-radius: 2px;
    cursor: pointer;
  }

  .got-it-btn:hover {
    background: var(--vscode-button-hoverBackground);
  }
</style>
