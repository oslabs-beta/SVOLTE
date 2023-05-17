<script>
  import * as d3 from 'd3';
  import { treeData } from "../stores";
  import { onMount } from 'svelte'

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
  root = treeLayout(root);
  console.log(root);
  root.x0 = height / 2;
  root.y0 = 0

  
  // transition duration
  let i = 0;
  const duration = 750;


//append the svg object to the body of the page
//appends a 'group' element to 'svg'
let svg;
onMount(() => {
  svg = d3
    .select("#body")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)

    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
;

    // generates nodes from an array of all nodes
    const node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal"
         : " node--leaf"))
      .attr("transform", d => "translate(" + d.y + "," +
         d.x + ")");
    console.log('these are nodes: ', node);


    // links between nodes
    // descendants().slice(1)
    const link = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .style('opacity', '1')
      .style("stroke", "black")
      .style("fill", "none")
      .style("stroke-width", "1px")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      // .style('opacity', '0.5')
      // .style("stroke", "red")
      // .attr("d", d => {
      //     return "M" + d.y + "," + d.x
      //        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
      //        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
      //        + " " + d.parent.y + "," + d.parent.x;
      // });
    console.log('these are the links: ', link);

    d3.selectAll(".link")

    // adds a circle to represent each node
    node.append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .style("stroke", d => d.data.type)
      .style("fill", d => d.children ? "red" : "black")
      

    node.append("text")
      .attr("x", 10)
      .attr("y", 5)
      .text(d => d.data.name)
      // .style("opacity", "0")
      // .on("mouseover", function () {
      //   d3.select(this)
      //   .style('opacity', '1')
      // })
      // .on("mouseout", function () {
      //   d3.select(this)
      //   .style('opacity', '1')
      // })



  // g.data(nodes.descendants());
})



</script>




 <main id='body'>
  component tree
  
 </main>