export function createNodesAndEdges() {
  const nodes = [];
  const edges = [];
  const imgList = [
    'https://cdn.vox-cdn.com/thumbor/9j-s_MPUfWM4bWdZfPqxBxGkvlw=/1400x1050/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg',
    'https://i.imgur.com/Jvh1OQm.jpeg',
    'https://i.imgur.com/x62B7BA.png'
  ];

  for (let i = 0; i < 9; i++) {
    nodes.push({
      id: `node-${i + 1}`,
      type: 'text',
      data: { label: `Test Idea ${i + 1}` },
      position: { x: 200 * (i % 3), y: 100 * Math.floor(i / 3) }
    })

    if (i !== 4) {
      edges.push({
        id: `edge-${i + 1}`,
        source: `node-${i + 1}`,
        target: 'node-5',
        type: 'idea_mapper_edge'
      })
    } 
  }

  nodes.push({
    id: `node-link-1`,
    type: 'link',
    data: { link: 'https://youtu.be/dQw4w9WgXcQ' },
    position: { x: 0, y: 300 }
  })

  for (let i = 0; i < 3; i++) {
    nodes.push({
      id: `node-img-${i + 1}`,
      type: 'image',
      data: { img_url: imgList[i] },
      position: { x: 200 * i, y: 400 }
    })
  }

  return {nodes, edges}
}