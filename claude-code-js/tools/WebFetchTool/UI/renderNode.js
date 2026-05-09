// function: renderNode
function renderNode(node2, options2) {
  switch (node2.type) {
    case Root:
      return render2(node2.children, options2);
    case Doctype:
    case Directive:
      return renderDirective(node2);
    case Comment:
      return renderComment(node2);
    case CDATA:
      return renderCdata(node2);
    case Script:
    case Style:
    case Tag:
      return renderTag(node2, options2);
    case Text3:
      return renderText(node2, options2);
  }
}
