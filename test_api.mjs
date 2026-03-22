const RES = await fetch("http://localhost:3000/api/iterate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    instruction: "Change all the text color in this heading to red, including the gradient text.",
    selectedElement: {
      uid: "h1-2-1",
      html: "<h1 data-uid=\"h1-2-1\" style=\"fontSize:clamp(3rem, 6vw, 4.5rem);fontWeight:800;lineHeight:1.1;marginBottom:2rem;maxWidth:1024px;marginLeft:auto;marginRight:auto;\">Build faster with our <br><span style=\"background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\">advanced platform</span></h1>",
      content: "Build faster with our advanced platform"
    },
    activeFile: "home",
    isGlobal: false
  })
});
const data = await RES.json();
console.log(JSON.stringify(data, null, 2));
