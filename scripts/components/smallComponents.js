/* 
    import randomColor from utils/utils.js
*/

function createTag(content, color, index){
    const tag = document.createElement("div");
    tag.setAttribute("class", "tag");
    tag.setAttribute("id", "tag-" + index);
    tag.setAttribute("value", content);

    // tag.setAttribute("style", `background-color: ${randomColor()}`);
    tag.setAttribute("style", /* `background-color: ${color}` */getTagStyle(color));

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

function createMark(content, isNOTEndMark){
    const mark = document.createElement("div");
    mark.setAttribute("class", "mark");
    let affix = "";
    if(! isNOTEndMark) affix = "-end";
    mark.setAttribute("id", "mark" + affix);
    mark.setAttribute("value", content);
    mark.appendChild(document.createTextNode(content));
    return mark;
}