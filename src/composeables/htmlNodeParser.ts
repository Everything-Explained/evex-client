
export function useHTMLNodeParser(html: string) {
  const youTubeHTML = 'embed-responsive-item youtube-player';
  const imageHTML   = '<img';
  const olHTML      = '<ol';

  function getNodesUsingBQ() {
    const htmlParts   = html.split('</blockquote>');
    const partsLength = htmlParts.length;
    const nodes: string[][] = [];

    htmlParts.forEach((p, i) => {
      const isLastIndex = i == partsLength - 1;
      if (isLastIndex) return nodes.push(...getNodesUsingP(p));

      if (p.includes('<blockquote>')) {
        const [html, bq] = p.split('<blockquote>');
        nodes.push(...getNodesUsingP(html), ['bq', bq]);
      }
    });

    return nodes;
  }

  function getNodesUsingP(newHTML?: string) {
    const htmlParts   = (newHTML ?? html).split('<p>');
    const nodes       = [] as string[][];

    for (const p of htmlParts) {
      if (!p.trim()) continue;
      if (p.includes(youTubeHTML)) { nodes.push(getNodeData(p, 'span')); continue; }
      if (p.includes(olHTML))      { nodes.push(...filterListNodes(p));  continue; }
      if (p.includes(imageHTML))   { nodes.push(...filterImageNodes(p)); continue; }
      nodes.push(getNodeData(p));
    }

    return nodes;
  }

  function filterListNodes(partialHTML: string) {
    const [pHTML, listHTML] = partialHTML.split(olHTML);
    // Some ordered lists need to "start" at a different number
    const attrib = listHTML.split('>', 1)[0].trim();
    const cleanList = attrib
      ? listHTML.trimStart().substring(attrib.length + 1).trim()
      : listHTML.trimStart().substring(1).trim()
    ;
    const listNodeData = getNodeData(cleanList, 'ol');
    if (attrib) listNodeData.push(attrib.split('"')[1]);
    return [getNodeData(pHTML), listNodeData];
  }

  function filterImageNodes(partialHTML: string) {
    const [nodeHTML, ...imagesHTML] = partialHTML.split(imageHTML);
    const imgNodeData = imagesHTML.map(getImgNodeData);
    return nodeHTML.trim() ? [getNodeData(nodeHTML), ...imgNodeData] : imgNodeData;
  }

  const getNodeData     = (html: string, el = 'p') => [el, html.trim().substring(0, html.length - 5)];
  const getImgNodeData  = (html: string)           => ['img', html.trim().split('https:')[1].split('"')[0]];

  return {
    getNodesUsingBQ,
    getNodesUsingP,
  };
}