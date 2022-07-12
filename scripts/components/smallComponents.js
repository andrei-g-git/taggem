/* 
    import randomColor from utils/utils.js
*/

function createTag(content, index){
    const tag = document.createElement("div");
    tag.setAttribute("class", "tag");
    tag.setAttribute("id", "tag-" + index);
    tag.setAttribute("value", content);

    tag.setAttribute("style", `background-color: ${randomColor()}`)

    tag.appendChild(document.createTextNode(content));
    return tag;
}