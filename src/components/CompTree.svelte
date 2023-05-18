<script>
  import * as d3 from 'd3';
  import { treeData } from "../stores";
  import { onMount, afterUpdate } from 'svelte'

  treeData.set({
        "name": "Eve",
        "children": [
        {"name": "Cain"},
        {"name": "Seth",
            "children": [
                {"name": "Enos"}, {"name": "Noam"}
            ]
        },
        {"name": "Abel"},
        {"name": "Awan",
            "children": [{"name": "Enoch"}]
        },
        {"name": "Azura"}]
    })
  console.log('this is tree data: ', $treeData)


  let margin = { top: 20, right: 90, bottom: 20, left: 90 };
  let width = 960 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;

  // create a tidy tree layout with specified size [height, width]
  const treeLayout = d3.tree()
    .size([height, width]);

  // defining nodes array from your dataset, child nodes are nested, returns a root
  let root = d3.hierarchy($treeData, d => d.children);
  root.x0 = height / 2;
  root.y0 = 0
  console.log('root ', root);


  
  // transition duration
  let i = 0;
  const duration = 750;


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

    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('y', d => d.children || d._children ? -15 : 0)
      .attr('x', 14)
      .attr('text-anchor', d => d.children || d._children ? "end" : "start")
      .text(d => d.data.name)

    nodeEnter
      .append('circle')
      .attr('r', 8)
      .style("fill", d => d._children ? "yellow" : "black")

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', d => 'translate(' + d.y + ', ' + d.x + ')')
      .select('circle.node')
      .attr('r', 8)
      .style('fill', d => d._children ? "yellow" : "black")
      .attr('cursor', 'pointer')

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
        let o = { x: source.x0, y: source.y0 };
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
        // console.log('node this:', nodeUpdate.select('circle.node'))
        // console.log('d3this lv 3: ', d3.select(this)._groups[0][0])
        console.log('d3this lv 3: ', d3.select(this)._groups[0][0].querySelector('circle').style.fill = 'yellow')
        console.log('d3this lv 2: ', d3.select(this)._groups[0][0])
        console.log('d3this lv 1: ', d3.select(this)._groups[0])
        console.log('d3this lv 0: ', d3.select(this)._groups)
        console.log('d3 this no level: ', d3.select(this))
        // d3.select(this)._groups[0][0].style.fill = 'yellow';
      } else {
        d.children = d._children;
        d._children = null;
        // d3.select(this).select('circle.node').style('fill', 'yellow')
        // console.log('node this:', nodeUpdate.select('circle.node'))
        // console.log('d3this lv 3: ', d3.select(this)._groups[0][0])
        console.log('d3this lv 3: ', d3.select(this)._groups[0][0].querySelector('circle').style.fill = 'black')
        console.log('d3this lv 2: ', d3.select(this)._groups[0][0])
        console.log('d3this lv 1: ', d3.select(this)._groups[0])
        console.log('d3this lv 0: ', d3.select(this)._groups)
        console.log('d3 this no level: ', d3.select(this))
        // d3.select(this)._groups[0][0].style.fill = 'black';
      }
      console.log('d: ', d);
      update(d);
    }


  }


    // // generates nodes from an array of all nodes
    // const node = svg.selectAll("g.node")
    //   .data(root.descendants())
    //   .enter().append("g")
    //   .attr("class", d => "node" + (d.children ? " node--internal"
    //      : " node--leaf"))
    //   .attr("transform", d => "translate(" + d.y + "," +
    //      d.x + ")");
    // console.log('these are nodes: ', node);


    // // links between nodes
    // // descendants().slice(1)
    // const link = svg.selectAll("g.link")
    //   .data(root.links())
    //   .enter().append("path")
    //   .attr("class", "link")
    //   .style('opacity', '0.6')
    //   .style("stroke", "purple")
    //   .style("fill", "none")
    //   .style("stroke-width", "3px")
    //   .attr("d", d3.linkHorizontal()
    //     .x(d => d.y)
    //     .y(d => d.x))
    //   // .style('opacity', '0.5')
    //   // .style("stroke", "red")
    //   // .attr("d", d => {
    //   //     return "M" + d.y + "," + d.x
    //   //        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
    //   //        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
    //   //        + " " + d.parent.y + "," + d.parent.x;
    //   // });
    // console.log('these are the links: ', link);

    // d3.selectAll(".link")

    // // adds a circle to represent each node
    // node.append("circle")
    //   .attr("class", "node")
    //   .attr("r", 10)
    //   .style("stroke", d => d.data.type)
    //   .style("fill", d => d.children ? "red" : "black")
      

    // node.append("text")
    //   .attr("x", 10)
    //   .attr("y", 5)
    //   .text(d => d.data.name)
    //   // .style("opacity", "0")
    //   // .on("mouseover", function () {
    //   //   d3.select(this)
    //   //   .style('opacity', '1')
    //   // })
    //   // .on("mouseout", function () {
    //   //   d3.select(this)
    //   //   .style('opacity', '1')
    //   // })


})



</script>




 <main id='body'>
  component tree
  
 </main>