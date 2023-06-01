<script>
  import * as d3 from 'd3';
  import { treeData, rootNodes, process_ctx } from '../store';
  import { onMount, afterUpdate } from 'svelte';

  let shouldWait = false;
  const treeColors = {
    childrenHidden: '#A0FFA1',
    childrenShown: '#A0FFFE',
    leafNode: '#D6B0FF',
    linkStroke: '#FCFFAE',
  };

  console.log('imported root: ', $rootNodes[0]);
  const rootNode = $rootNodes[0];

  /* states and locally defined variables are in ctx property
  props from a parent component are in attributes property */

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
    const output = {};
    output.name = root.tagName;
    if (root.detail.ctx) {
      output.variables = process_ctx(root.detail.ctx);
    }
    if (root.detail.attributes) {
      output.props = process_ctx(root.detail.attributes);
    }

    output.children = nodeTraverse(root.children); //array of child objects

    // output: this is the tree data we will use
    return output;
  }

  if ($rootNodes[0]) {
    const parsedData = rootParser($rootNodes[0]);
    treeData.set(parsedData);
  }
  console.log('tree data after parsing ', $treeData);

  let margin = { top: 20, right: 90, bottom: 20, left: 90 };
  let width = 960 - margin.left - margin.right;
  let height = 600 - margin.top - margin.bottom;

  // create a tidy tree layout with specified size [height, width]
  const treeLayout = d3.tree().size([height, width]);

  // transition duration
  let i = 0;
  const duration = 500;
  //adding a counter so we can number the g nodes in the order they are incremented
  //(will help us resolve a bug where nodes are superimposed over textboxes in onhover events later)
  let counter = 0;

  function update(source) {
    const treeData = treeLayout(root);

    // nodes
    const nodes = treeData.descendants();
    nodes.forEach((d) => (d.y = d.depth * 150));

    const node = svg
      .selectAll('g.node')
      .data(nodes, (d) => d.id || (d.id = ++i));

    //attaching a circle to represent each node
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr(
        'transform',
        (d) => 'translate(' + source.y0 + ', ' + source.x0 + ')'
      )
      .attr('id', () => `${counter++}`)
      .on('click', click);

    const circleSVG = nodeEnter
      .append('circle')
      .attr('r', 8)
      .style('fill', (d) =>
        d.children
          ? treeColors.childrenShown
          : d._children
          ? treeColors.childrenHidden
          : treeColors.leafNode
      )
      .attr('cursor', 'pointer');

    const gSVG = nodeEnter.append('g').attr('transform', 'translate(-6, 4)');

    //adding component name to each node
    const text = nodeEnter
      .append('text')
      .attr('dy', '.35em')
      .attr('y', (d) => (d.children || d._children ? -20 : 0))
      .attr('x', 14)
      .attr('text-anchor', (d) => (d.children || d._children ? 'end' : 'start'))
      .text((d) => d.data.name)
      .style('fill', 'aliceblue');

    const rect = gSVG
      .append('rect')
      .attr('width', (d) => `${((d.data.name.length * 81) / 945) * 100}vh`)
      .attr('height', (d) => `${((d.data.name.length * 81) / 945) * 100}vh`)
      .attr('fill', '#F5F5F5')
      .style('opacity', 0)
      .attr('rx', 10)
      .attr('ry', 10);

    const enterSVG = gSVG
      .append('foreignObject')
      .attr('width', (d) => `${((d.data.name.length * 80 + 10) / 945) * 100}vh`)
      .attr(
        'height',
        (d) => `${((d.data.name.length * 80 + 10) / 945) * 100}vh`
      );

    const textDiv = enterSVG
      .append('xhtml:div')
      .style('font-size', '15px')
      .style('overflow-wrap', 'anywhere')
      .style('color', 'black')
      .text((d) => d.data.name)
      .style('opacity', 0)
      .attr('class', 'wrapped-text')
      .style('word-wrap', 'break-word')
      .style('font-family', 'Arial');

    circleSVG.on('mouseover', function (event, d) {
      let str = '';
      let textLength = 0;
      let varTextContent = '';
      let propTextContent = '';
      let elCounter = 0;
      if (d.data.variables) elCounter += 2;
      for (const el of d.data.variables) {
        if (typeof el.value === 'object') {
          for (const [key, value] of Object.entries(el.value)) {
            if (typeof value === 'string') {
              // textLength += value.length;
              textLength = Math.max(
                textLength,
                `${el.value}`.length + `${el.key}`.length
              );
              varTextContent += `${key} — ${value}<br>`;
              elCounter += 1;
            }
          }
        } else {
          // textLength += `${el.value}`.length;
          textLength = Math.max(
            textLength,
            `${el.value}`.length + `${el.key}`.length
          );
          varTextContent += `${el.key}: ${el.value}<br>`;
          elCounter += 1;
        }
      }
      for (const el of d.data.props) {
        if (typeof el.value === 'object') {
          for (const [key, value] of Object.entries(el.value)) {
            if (typeof value === 'string') {
              // textLength += value.length;
              textLength = Math.max(
                textLength,
                `${el.value}`.length + `${el.key}`.length
              );
              propTextContent += `${key} — ${value}<br>`;
              elCounter += 1;
            }
          }
        } else {
          // textLength += `${el.value}`.length;
          textLength = Math.max(
            textLength,
            `${el.value}`.length + `${el.key}`.length
          );
          propTextContent += `${el.key}: ${el.value}<br>`;
          elCounter += 1;
        }
      }
      console.log('d.data.variables: ', d.data.variables);
      console.log(
        'd.data.name: ',
        d.data.name,
        'textLength: ',
        textLength,
        'varTextContent: ',
        varTextContent
      );
      d3.select(this.parentNode)
        .select('foreignObject')
        .select('div')
        .style('opacity', 1)
        .style('padding', '10px 5px 15px 15px')
        .html(`Variables<hr>${varTextContent}Props<hr>${propTextContent}`);
      const rectWidth = Math.ceil(textLength * 12);
      console.log('this is textLength: ', textLength);
      const rectHeight = Math.ceil(elCounter * 35);
      console.log(
        'this is elCounter: ',
        elCounter,
        'this is it *60: ',
        elCounter * 60
      );
      textDiv.style('width', `${(rectWidth / 945) * 100}vh`);
      textDiv.style('height', `${((rectHeight * 0.9) / 945) * 100}vh`);
      d3.select(this.parentNode)
        .select('rect')
        .attr('width', `${(rectWidth / 945) * 100}vh`);
      d3.select(this.parentNode)
        .select('rect')
        .attr('height', `${(rectHeight / 945) * 110}vh`);
      d3.select(this.parentNode)
        .select('foreignObject')
        .attr('width', `${((textLength * 10.5) / 945) * 100}vh`);
      d3.select(this.parentNode).select('rect').style('opacity', 1);
      //handling text bug
      console.log('d3 select this.parentNode: ', d3.select(this.parentNode));

      //older solution, makes all other nodes clear
      // d3.selectAll('circle').style('opacity', 0);
      // d3.selectAll('text').style('opacity', 0);

      d3.select(this).style('opacity', 1);
      d3.select(this.parentNode).select('text').style('opacity', 1);
      const currentNodeId = Number(this.parentNode.id);
      d3.selectAll('g.node').each(function () {
        const nodeId = this.id;
        const nodeNumber = Number(nodeId);
        if (nodeNumber > currentNodeId) {
          d3.select(this).style('opacity', 0);
        }
      });
    });

    circleSVG.on('mouseout', function (event, d) {
      //handling text bug

      //older solution, makes all other nodes visible on hover (were previously not)
      // d3.selectAll('circle').style('opacity', 1);
      // d3.selectAll('text').style('opacity', 1)

      //rest of code handling foreign object of current element's opacity
      d3.select(this.parentNode)
        .select('foreignObject')
        .select('div')
        .style('opacity', 0);
      d3.select(this.parentNode).select('rect').style('opacity', 0);
      const currentNodeId = Number(this.parentNode.id);
      d3.selectAll('g.node').each(function () {
        const nodeId = this.id;
        const nodeNumber = Number(nodeId);
        if (nodeNumber > currentNodeId) {
          d3.select(this).style('opacity', 1);
        }
      });
    });

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', (d) => 'translate(' + d.y + ', ' + d.x + ')')
      .select('circle.node')
      .attr('r', 8);
    // .style('fill', d => d._children ? "yellow" : "black")

    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', (d) => 'translate(' + source.y + ',' + source.x + ')')
      .remove();

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
    let link = svg.selectAll('path.link').data(links, (d) => d.id);
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d) => {
        let o = { x: source.x0, y: source.y };
        return diagonal(o, o);
      })
      .style('opacity', '0.9')
      .style('stroke', '#FCFFAE')
      .style('stroke-width', '3px')
      .style('fill', 'none');

    const linkUpdate = linkEnter.merge(link);
    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', (d) => diagonal(d, d.parent));

    const linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', (d) => {
        let o = { x: source.x, y: source.y };
        return diagonal(o, o);
      })
      .remove();

    // store old positions to be able to transition back
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // define click function
    function click(event, d) {
      if (shouldWait) return;

      if (d.children) {
        d._children = d.children;
        d.children = null;
        d3.select(this)._groups[0][0].querySelector('circle').style.fill =
          '#A0FFA1';
      } else {
        d.children = d._children;
        d._children = null;
        d3.select(this)._groups[0][0].querySelector('circle').style.fill =
          '#A0FFFE';
      }

      // throttle
      shouldWait = true;
      setTimeout(() => {
        shouldWait = false;
      }, 500);

      update(d);
    }
  }

  //append the svg object to the body of the page
  //appends a 'group' element to 'svg'
  let svg;
  let root;
  onMount(() => {
    /* d3.hierarchy(data,[children]) assigns parent, child, height, depth
    used to construct a root node data from a given hierarchial data
    data MUST be of an object and represent a root node
    returns an array of object(s) */
    root = d3.hierarchy($treeData, (d) => d.children);
    root.each((d) => {
      if (d.children) {
        d.children.forEach((child, i) => {
          child.data.originalOrder = i;
        });
      }
    });
    root.x0 = height / 2;
    root.y0 = 0;
    console.log('root ', root);
    if ($treeData) {
      svg = d3
        .select('#body')
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr(
          'transform',
          'translate(' + margin.left + ', ' + margin.top + ')'
        );

      update(root);
    }
  });

  afterUpdate(() => {
    if ($treeData && svg) {
      update(root);
    }
  });
</script>

<main id="body" style="overflow: auto;" />
