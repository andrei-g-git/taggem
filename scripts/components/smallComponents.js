/* 
    import randomColor from utils/utils.js
*/

function createTag(content, color, index){
    const tag = document.createElement("div");
    tag.setAttribute("class", "tag");
    tag.setAttribute("id", "tag-" + index);
    tag.setAttribute("value", content);

    // tag.setAttribute("style", `background-color: ${randomColor()}`);
    //tag.setAttribute("style", /* `background-color: ${color}` */getTagStyle(color));

    const coloredNudge = document.createElement("div");
    coloredNudge.setAttribute("class", "tag-nudge");
    coloredNudge.setAttribute("id", "tag-nudge-" + index);
    coloredNudge.setAttribute("style", getNudgeStyle(color))

    tag.appendChild(coloredNudge);
    tag.appendChild(document.createTextNode(content));
    return tag;
}

function getTagStyle(color){
    // return`
    //     border-left: solid 30px ${color};
    //     border-top: solid 500px transparent;
    //     border-bottom: solid 500px transparent;
    //     background-color: ${color};
    // `;
    return `
        border-left: solid 4px ${color};
        background-color: rgb(220, 220, 220);
    `;
}

function getNudgeStyle(color){
    return `
        background-color: ${color};
    `;
}

function createMarkGroup(content, isNOTEndMark){
    const mark = document.createElement("div");
    mark.setAttribute("class", "mark");
    let label = "start:";
    let affix = "";
    if(! isNOTEndMark){
        affix = "-end";
        label = "end:";
    }
    mark.setAttribute("id", "mark" + affix);
    mark.setAttribute("value", content);
    mark.appendChild(document.createTextNode(content));

    const labelTag = document.createElement("label");
    labelTag.setAttribute("class", "mark-label");
    labelTag.setAttribute("id", "mark-label" + affix);
    labelTag.setAttribute("for", "mark-label" + affix);
    labelTag.appendChild(document.createTextNode(label));

    const markGroup = document.createElement("div");
    markGroup.setAttribute("class", "mark-group");
    markGroup.setAttribute("id", "mark-group" + affix);
    
    markGroup.appendChild(labelTag);   
    markGroup.appendChild(mark);

    return markGroup;//mark;
}