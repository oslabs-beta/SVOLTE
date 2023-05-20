<script>
  import * as d3 from 'd3';
  import { treeData } from "../stores";
  import { onMount, afterUpdate } from 'svelte'

  // treeData.set({
  //       "name": "Eve",
  //       "children": [
  //       {"name": "Cain"},
  //       {"name": "Seth",
  //           "children": [
  //               {"name": "Enos"}, {"name": "Noam"}
  //           ]
  //       },
  //       {"name": "Abel"},
  //       {"name": "Awan",
  //           "children": [{"name": "Enoch"}]
  //       },
  //       {"name": "Azura"}]
  //   })
  // console.log('this is tree data: ', $treeData)


  treeData.set({
    "name": "Root",
    "children": [
    {"name": "Counter1",
    "children": [
      {"name": "Increment"}, 
      {"name": "Decrement"}
      ]
    },
    {"name": "Counter2"}
  ]
  })


  let margin = { top: 20, right: 90, bottom: 20, left: 90 };
  let width = 960 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;

  // create a tidy tree layout with specified size [height, width]
  const treeLayout = d3.tree()
    .size([height, width]);


  //assigns parent, child, height, depth
  //d3.hierarchy(data,[children])
  //used to construct a root node data from a given hierarchial data
  //data MUST be of an object and represent a root node
  //returns an array of object(s)
  let root = d3.hierarchy($treeData, d => d.children);
  root.x0 = height / 2;
  root.y0 = 0
  console.log('root ', root);


  
  // transition duration
  let i = 0;
  const duration = 500;


//append the svg object to the body of the page
//appends a 'group' element to 'svg'
let svg;
afterUpdate(() => {
  svg = d3
    .select("#body")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")


  update(root)

  function update(source) {
    const treeData = treeLayout(root)

    // nodes
    const nodes = treeData.descendants();
    nodes.forEach(d => d.y = d.depth * 180);

    const node = svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++ i));

    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
    //   .attr('class', d => "node" + (d.children ? " node--internal"
    //      : " node--leaf"))
      .attr('transform', d => "translate(" + source.y0 + ", " + source.x0 + ")")
      .on('click', click)

    // adding component name to each node
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('y', d => d.children || d._children ? -15 : 0)
      .attr('x', 14)
      .attr('text-anchor', d => d.children || d._children ? "end" : "start")
      .text(d => d.data.name)

    // attaching a circle to represent each node
    nodeEnter
      .append('circle')
      .attr('r', 8)
      .style("fill", d => d._children ? "yellow" : "black")
      .attr('cursor', 'pointer')

    nodeEnter
      .append('svg')
      .attr('width', 500)
      .attr('height', 500)
      .attr('class', 'nodeText')
      .text('TESTING')

    // nodeEnter
    //   .append('text')
    //   .text('TEST')
    //   // .attr('y', d => d.y0 + 20)
    //   .style('fill', 'white')
      



    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', d => 'translate(' + d.y + ', ' + d.x + ')')
      .select('circle.node')
      .attr('r', 8)
      .style('fill', d => d._children ? "yellow" : "black")

    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', d => 'translate(' + source.y + ',' + source.x + ')')
      .remove()

    nodeExit.select('circle').attr('r', 0);
    nodeExit.select('text').style('fill-opacity', 0);


    // links
    function diagonal(s, d) {
      let path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x}
          ${(s.y + d.y) / 2} ${d.x}
          ${d.y} ${d.x}`;
      return path;
    }

    let links = treeData.descendants().slice(1);
    let link = svg.selectAll('path.link').data(links, d => d.id)
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        let o = { x: source.x0, y: source.y }
        return diagonal(o, o)
      })
      .style('opacity', '0.6')
      .style("stroke", "purple")
      .style('stroke-width', '3px')
      .style('fill', 'none')

    const linkUpdate = linkEnter.merge(link);
    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', d => diagonal(d, d.parent))

    const linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', d => {
        let o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    // store old positions to be able to transition back
    nodes.forEach(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    })

    // define click function
    function click(event, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
        d3.select(this)._groups[0][0].querySelector('circle').style.fill = 'yellow';
        // console.log('d3this lv 2: ', d3.select(this)._groups[0][0])
        // console.log('d3 this no level: ', d3.select(this))
      } else {
        d.children = d._children;
        d._children = null;
        d3.select(this)._groups[0][0].querySelector('circle').style.fill = 'black';
        // console.log('d3this lv 2: ', d3.select(this)._groups[0][0])
        // console.log('d3 this no level: ', d3.select(this))
      }
      console.log('d: ', d);
      update(d);
    }


  }

})



</script>

 <main id='body'>
  
 </main>