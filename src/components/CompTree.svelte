<script>
  import * as d3 from 'd3';
  import { treeData, rootNodes } from '../store';
  import { onMount, afterUpdate } from 'svelte'


  console.log('imported root: ', $rootNodes[0]);
  const rootNode = $rootNodes[0];

  /* states and locally defined variables are in ctx property
  props from a parent component are in attributes property */

  /* Tree data template from root node
  {
    "name": "Root",
    "variables": {},
    "children": [
      {
        "name": "Layout",
        "variables": {},
        "children": [
          {
            "name": "Header",
            "variables": {},
            "children": [],
          }
          {
            "name": "Page",
            "variables": {},
            "children": [
              {
                "name": "Counter",
                "variables": { count: 0 },
                "children": []
              }
            ]
          }
        ]
      }
    ]

  }*/
  

  /* iterates through children array of each node, if a child is a component then 
  calls rootParser on that component to add it as a child object to the parent node's children array.
  If not a component, continues down branch until it reaches a component or a node with no children.
  */
  function nodeTraverse(arr, childrenArr = []) {
    if (arr.length === 0) return;
    for (let node of arr) {
      if (node.type === 'component') childrenArr.push(rootParser(node));
      else {
        nodeTraverse(node.children, childrenArr);
      }
    }

    return childrenArr;
  }

// NOTE: rootNodes from store is an array with the root node object as its only element
  function rootParser(root) {
    // root is an object
    // output is an object
    // if (root) {
      const output = {};
      output.name = root.tagName;
      output.variables = root.detail.ctx; // array of objs
      // placeholder line to set variables property (ctx)
  
      
      output.children = nodeTraverse(root.children); //array of child objects
  
  
      // output: this is the tree data we will use (see tree data template above)
      // console.log('root parser output: ', output);
      return output;
    // }
  }

  if ( $rootNodes[0]) {
    const parsedData = rootParser($rootNodes[0]);
    console.log('result of parsing ', parsedData);
    treeData.set(parsedData);
  };
  console.log('tree data after parsing ', $treeData);

// dummy data
  // treeData.set({
  //   "name": "Root",
  //   "age": 10,
  //   "nickname":'Tanner',
  //   "children": [
  //     { "name": "Counter1",
  //       "age": 11,
  //       "nickname":'Jake',
  //       "children": [
  //         { "name": "Increment",
  //           "age": 12,
  //           "nickname":'Alison'
  //         }, 
  //         { "name": "Decrement",
  //           "age": 13,
  //           "nickname":'Demetri',
  //         }
  //       ]
  //     },
  //     { "name": "Counter2",
  //       "age": 14,
  //       "nickname":'Tyson'
  //     }
  //   ]
  // })


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



  
  // transition duration
  let i = 0;
  const duration = 500;

  function update(source) {
    const treeData = treeLayout(root)

    // nodes
    const nodes = treeData.descendants();
    nodes.forEach(d => d.y = d.depth * 180);

    const node = svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++ i));

  //attaching a circle to represent each node
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => "translate(" + source.y0 + ", " + source.x0 + ")")
    .on('click', click);

  const circleSVG = nodeEnter.append('circle')
    .attr('r', 8)
    .style("fill", d => d._children ? "yellow" : "#D6B0FF")
    .attr('cursor', 'pointer');

  const gSVG = nodeEnter.append('g')
    .attr("transform", "translate(-6, 4)");

    //adding component name to each node
    nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('y', d => d.children || d._children ? -20 : 0)
      .attr('x', 14)
      .attr('text-anchor', d => d.children || d._children ? "end" : "start")
      .text(d => d.data.name)
      .style('fill', 'aliceblue')

    const rect = gSVG.append("rect")
      .attr("width", d => `${d.data.name.length * 81}px`)
      .attr("height", d => `${d.data.name.length * 81}px`)
      .attr("fill", "#F5F5F5")
      .style("opacity", 0)

    const enterSVG = gSVG.append("foreignObject")
      .attr("width", d => `${d.data.name.length * 80 + 10}px`)
      .attr("height", d => `${d.data.name.length * 80 + 10}px`)

    const textDiv = enterSVG.append("xhtml:div")
      .style("font-size", "15px")
      .style("overflow-wrap", "anywhere") 
      .style("color", "black")
      .text(d => d.data.name)
      .style("opacity", 0)
      .attr("class", "wrapped-text")
      .style("word-wrap", "break-word")
      .style("font-family", "Arial");



    circleSVG.on("mouseover", function(event, d){
      let str = '';
      let textLength = 0;
      let textContent = '';
      for (const el of d.data.variables){
        console.log('el: ', el)
        if (!el.value.source){
          if (typeof el.value === "object") {
            for (const [key, value] of Object.entries(el.value)) { 
              if (typeof value === "string") {
                textLength += value.length;
                textContent += `${key} — ${value}<br>`; 
              }
            }
          } else if (typeof el.value === "string") {
            textLength += el.value.length;
            textContent += `${el.key} — ${el.value}<br>`; 
          }
        }
      }
      console.log('d.data.variables: ', d.data.variables)
      console.log('d.data.name: ', d.data.name, 'textLength: ', textLength, 'textContent: ', textContent)
      d3.select(this.parentNode).select("foreignObject").select("div").style("opacity", 1).style("padding", "10px 5px 15px 15px").html(`Variables<hr>${textContent}`);
      const rectWidth = textLength * 80;
      const rectHeight = Math.max(70, Math.ceil(textLength * 1.7));
      textDiv.style("width", `${rectWidth*0.9}px`);
      textDiv.style("height", `${rectHeight*0.9}px`);

      d3.select(this.parentNode).select("rect").attr("width", rectWidth);
      d3.select(this.parentNode).select("rect").attr("height", rectHeight)
      d3.select(this.parentNode).select("foreignObject").attr("width", `${textLength * 80}px`);
      d3.select(this.parentNode).select('rect').style('opacity', 1);
    });




    circleSVG.on("mouseout", function(event, d) {
      // console.log('d3.select(this.parentNode): ', d3.select(this.parentNode))
      d3.select(this.parentNode).select('foreignObject').select('div').style("opacity", 0);
      d3.select(this.parentNode).select('rect').style('opacity', 0);
    });

    
    
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
      .style('opacity', '0.9')
      .style("stroke", "#FCFFAE")
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
        d3.select(this)._groups[0][0].querySelector('circle').style.fill = '#A0FFA1';
        // console.log('d3this lv 2: ', d3.select(this)._groups[0][0])
        // console.log('d3 this no level: ', d3.select(this))
      } else {
        d.children = d._children;
        d._children = null;
        d3.select(this)._groups[0][0].querySelector('circle').style.fill = '#A0FFFE';
        // console.log('d3this lv 2: ', d3.select(this)._groups[0][0])
        // console.log('d3 this no level: ', d3.select(this))
      }
      console.log('d: ', d);
      update(d);
    }


  }


//append the svg object to the body of the page
//appends a 'group' element to 'svg'
let svg;
let root;
onMount(() => {

  root = d3.hierarchy($treeData, d => d.children);
  root.x0 = height / 2;
  root.y0 = 0
  console.log('root ', root);
  if($treeData){
      svg = d3
    .select("#body")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")


  update(root)


  }


})

afterUpdate(() => {
    if ($treeData && svg) {
      update(root);
    }
  });


</script>




<main id='body' style='overflow: auto;'>
  
</main>