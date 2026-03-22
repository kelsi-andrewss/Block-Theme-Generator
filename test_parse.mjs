function parseStyleString(styleStr) {
  const styleObj = {};
  styleStr.split(';').forEach(rule => {
    const splitIndex = rule.indexOf(':');
    if (splitIndex !== -1) {
      let key = rule.slice(0, splitIndex).trim();
      if (!key.startsWith('--')) {
        key = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      }
      const value = rule.slice(splitIndex + 1).trim();
      if (key && value) {
        styleObj[key] = value;
      }
    }
  });
  return styleObj;
}
console.log(parseStyleString("color: red; fontSize:clamp(3rem, 6vw, 4.5rem);fontWeight:800;lineHeight:1.1;marginBottom:2rem;maxWidth:1024px;marginLeft:auto;marginRight:auto;"));
