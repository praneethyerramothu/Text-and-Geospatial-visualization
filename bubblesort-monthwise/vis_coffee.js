
root = exports ? this

Bubbles = () ->
  # standard variables accessible to
  # the rest of the functions inside Bubbles
  width = 450
  height = 400
  data = []
  node = null
  label = null
  margin = {top: 0, right: 0, bottom: 0, left: 0}
  # largest size for our bubbles
  maxRadius = 29

  # this scale will be used to size our bubbles
  rScale = d3.scale.sqrt().range([0,maxRadius])
  
  # I've abstracted the data value used to size each
  # into its own function. This should make it easy
  # to switch out the underlying dataset
  rValue = (d) -> parseInt(d.frequency)

  # function to define the 'id' of a data element
  #  - used to bind the data uniquely to the force nodes
  #   and for url creation
  #  - should make it easier to switch out dataset
  #   for your own
  idValue = (d) -> d.word

  # function to define what to display in each bubble
  #  again, abstracted to ease migration to 
  #  a different dataset if desired
  textValue = (d) -> d.word

  # constants to control how
  # collision look and act
  collisionPadding = 4
  minCollisionRadius = 12

  # variables that can be changed
  # to tweak how the force layout
  # acts
  # - jitter controls the 'jumpiness'
  #  of the collisions
  jitter = 0.5

  # ---
  # tweaks our dataset to get it into the
  # format we want
  # - for this dataset, we just need to
  #  ensure the frequency is a number
  # - for your own dataset, you might want
  #  to tweak a bit more
  # ---
  transformData = (rawData) ->
    rawData.forEach (d) ->
      d.frequency = parseInt(d.frequency)
      rawData.sort(() -> 0.5 - Math.random())
    rawData

  # ---
  # tick callback function will be executed for every
  # iteration of the force simulation
  # - moves force nodes towards their destinations
  # - deals with collisions of force nodes
  # - updates visual bubbles to reflect new force node locations
  # ---
  tick = (e) ->
    dampenedAlpha = e.alpha * 0.5
    
    # Most of the work is done by the gravity and collide
    # functions.
    node
      .each(gravity(dampenedAlpha))
      .each(collide(jitter))
      .attr("transform", (d) -> "translate(#{d.x},#{d.y})")

    # As the labels are created in raw html and not svg, we need
    # to ensure we specify the 'px' for moving based on pixels
    label
      .style("left", (d) -> ((margin.left + d.x) - d.dx / 2) + "px")
      .style("top", (d) -> ((margin.top + d.y) - d.dy / 2) + "px")

  # The force variable is the force layout controlling the bubbles
  # here we disable gravity and charge as we implement custom versions
  # of gravity and collisions for this visualization
  force = d3.layout.force()
    .gravity(0)
    .charge(0)
    .size([width, height])
    .on("tick", tick)

  # ---
  # Creates new chart function. This is the 'constructor' of our
  #  visualization
  # Check out http://bost.ocks.org/mike/chart/ 
  #  for a explanation and rational behind this function design
  # ---
  chart = (selection) ->
    selection.each (rawData) ->

      # first, get the data in the right format
      data = transformData(rawData)
      # setup the radius scale's domain now that
      # we have some data
      maxDomainValue = d3.max(data, (d) -> rValue(d))
      rScale.domain([0, maxDomainValue])

      # a fancy way to setup svg element
      svg = d3.select(this).selectAll("svg").data([data])
      svgEnter = svg.enter().append("svg")
      svg.attr("width", width + margin.left + margin.right )
      svg.attr("height", height + margin.top + margin.bottom )
      
      # node will be used to group the bubbles
      node = svgEnter.append("g").attr("id", "bubble-nodes")
        .attr("transform", "translate(#{margin.left},#{margin.top})")

      # clickable background rect to clear the current selection
      node.append("rect")
        .attr("id", "bubble-background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clear)

      # label is the container div for all the labels that sit on top of 
      # the bubbles
      # - remember that we are keeping the labels in plain html and 
      #  the bubbles in svg
      label = d3.select(this).selectAll("#bubble-labels").data([data])
        .enter()
        .append("div")
        .attr("id", "bubble-labels")

      update()

      # see if url includes an id already 
      hashchange()

      # automatically call hashchange when the url has changed
      d3.select(window)
        .on("hashchange", hashchange)

  # ---
  # update starts up the force directed layout and then
  # updates the nodes and labels
  # ---
  update = () ->
    # add a radius to our data nodes that will serve to determine
    # when a collision has occurred. This uses the same scale as
    # the one used to size our bubbles, but it kicks up the minimum
    # size to make it so smaller bubbles have a slightly larger 
    # collision 'sphere'
    data.forEach (d,i) ->
      d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)))

    # start up the force layout
    force.nodes(data).start()

    # call our update methods to do the creation and layout work
    updateNodes()
    updateLabels()

  # ---
  # updateNodes creates a new bubble for each node in our dataset
  # ---
  updateNodes = () ->
    # here we are using the idValue function to uniquely bind our
    # data to the (currently) empty 'bubble-node selection'.
    # if you want to use your own data, you just need to modify what
    # idValue returns
    node = node.selectAll(".bubble-node").data(data, (d) -> idValue(d))

    # we don't actually remove any nodes from our data in this example 
    # but if we did, this line of code would remove them from the
    # visualization as well
    node.exit().remove()

    # nodes are just links with circles inside.
    # the styling comes from the css
    node.enter()
      .append("a")
      .attr("class", "bubble-node")
      .attr("xlink:href", (d) -> "##{encodeURIComponent(idValue(d))}")
      .call(force.drag)
      .call(connectEvents)
      .append("circle")
      .attr("r", (d) -> rScale(rValue(d)))

  # ---
  # updateLabels is more involved as we need to deal with getting the sizing
  # to work well with the font size
  # ---
  updateLabels = () ->
    # as in updateNodes, we use idValue to define what the unique id for each data 
    # point is
    label = label.selectAll(".bubble-label").data(data, (d) -> idValue(d))

    label.exit().remove()

    # labels are anchors with div's inside them
    # labelEnter holds our enter selection so it 
    # is easier to append multiple elements to this selection
    labelEnter = label.enter().append("a")
      .attr("class", "bubble-label")
      .attr("href", (d) -> "##{encodeURIComponent(idValue(d))}")
      .call(force.drag)
      .call(connectEvents)

    labelEnter.append("div")
      .attr("class", "bubble-label-word")
      .text((d) -> textValue(d))

    labelEnter.append("div")
      .attr("class", "bubble-label-value")
      .text((d) -> rValue(d))

    # label font size is determined based on the size of the bubble
    # this sizing allows for a bit of overhang outside of the bubble
    # - remember to add the 'px' at the end as we are dealing with 
    #  styling divs
    label
      .style("font-size", (d) -> Math.max(5, rScale(rValue(d) / 4)) + "px")
      .style("width", (d) -> 2.5 * rScale(rValue(d)) + "px")

    # interesting hack to get the 'true' text width
    # - create a span inside the label
    # - add the text to this span
    # - use the span to compute the nodes 'dx' value
    #  which is how much to adjust the label by when
    #  positioning it
    # - remove the extra span
    label.append("span")
      .text((d) -> textValue(d))
      .each((d) -> d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width))
      .remove()

    # reset the width of the label to the actual width
    label
      .style("width", (d) -> d.dx + "px")
  
    # compute and store each nodes 'dy' value - the 
    # amount to shift the label down
    # 'this' inside of D3's each refers to the actual DOM element
    # connected to the data node
    label.each((d) -> d.dy = this.getBoundingClientRect().height)
  
  # ---
  # updateLabels is more involved as we need to deal with getting the sizing
  # to work well with the font size
  # ---
  updateLabels2 = () ->
    # as in updateNodes, we use idValue to define what the unique id for each data 
    # point is
    label = label.selectAll(".bubble-label").data(data, (d) -> idValue(d))

    label.exit().remove()

    # labels are anchors with div's inside them
    # labelEnter holds our enter selection so it 
    # is easier to append multiple elements to this selection
    labelEnter = label.enter().append("a")
      .attr("class", "bubble-label")
      .attr("href", (d) -> "##{encodeURIComponent(idValue(d))}")
      .call(force.drag)
      .call(connectEvents)

    labelEnter.append("div")
      .attr("class", "bubble-label-word")
      .text((d) -> textValue(d))

    labelEnter.append("div")
      .attr("class", "bubble-label-value")
      .text((d) -> rValue(d))

    # label font size is determined based on the size of the bubble
    # this sizing allows for a bit of overhang outside of the bubble
    # - remember to add the 'px' at the end as we are dealing with 
    #  styling divs
    label
      .style("font-size", (d) -> Math.max(5, rScale(rValue(d) / 4)) + "px")
      .style("width", (d) -> 2.5 * rScale(rValue(d)) + "px")

    # interesting hack to get the 'true' text width
    # - create a span inside the label
    # - add the text to this span
    # - use the span to compute the nodes 'dx' value
    #  which is how much to adjust the label by when
    #  positioning it
    # - remove the extra span
    label.append("span")
      .text((d) -> textValue(d))
      .each((d) -> d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width))
      .remove()

    # reset the width of the label to the actual width
    label
      .style("width", (d) -> d.dx + "px")
  
    # compute and store each nodes 'dy' value - the 
    # amount to shift the label down
    # 'this' inside of D3's each refers to the actual DOM element
    # connected to the data node
    label.each((d) -> d.dy = this.getBoundingClientRect().height)
  # ---
  # custom gravity to skew the bubble placement
  # ---
  gravity = (alpha) ->
    # start with the center of the display
    cx = width / 2
    cy = height / 2
    # use alpha to affect how much to push
    # towards the horizontal or vertical
    ax = alpha / 2
    ay = alpha

    # return a function that will modify the
    # node's x and y values
    (d) ->
      d.x += (cx - d.x) * ax
      d.y += (cy - d.y) * ay

  # ---
  # custom collision function to prevent
  # nodes from touching
  # This version is brute force
  # we could use quadtree to speed up implementation
  # (which is what Mike's original version does)
  # ---
  collide = (jitter) ->
    # return a function that modifies
    # the x and y of a node
    (d) ->
      data.forEach (d2) ->
        # check that we aren't comparing a node
        # with itself
        if d != d2
          # use distance formula to find distance
          # between two nodes
          x = d.x - d2.x
          y = d.y - d2.y
          distance = Math.sqrt(x * x + y * y)
          # find current minimum space between two nodes
          # using the forceR that was set to match the 
          # visible radius of the nodes
          minDistance = d.forceR + d2.forceR + collisionPadding

          # if the current distance is less then the minimum
          # allowed then we need to push both nodes away from one another
          if distance < minDistance
            # scale the distance based on the jitter variable
            distance = (distance - minDistance) / distance * jitter
            # move our two nodes
            moveX = x * distance
            moveY = y * distance
            d.x -= moveX
            d.y -= moveY
            d2.x += moveX
            d2.y += moveY

  # ---
  # adds mouse events to element
  # ---
  connectEvents = (d) ->
    d.on("click", click)
    d.on("mouseover", mouseover)
    d.on("mouseout", mouseout)

  # ---
  # clears currently selected bubble
  # ---
  clear = () ->
    location.replace("#")

  # ---
  # changes clicked bubble by modifying url
  # ---
  click = (d) ->
    location.replace("#" + encodeURIComponent(idValue(d)))
    d3.event.preventDefault()

  # ---
  # called when url after the # changes
  # ---
  hashchange = () ->
    id = decodeURIComponent(location.hash.substring(1)).trim()
    updateActive(id)

  # ---
  # activates new node
  # ---
  updateActive = (id) ->
    node.classed("bubble-selected", (d) -> id == idValue(d))
    # if no node is selected, id will be empty
    if id.length > 0
      selected.pop();
      selected.push(id);
      word.append("path")
      .attr("class", "line")
      .attr("d", linevalues)
      .style("stroke", (d) -> return z(d.id));
      d3.select("#status").html("<h3><span class=\"active\"></span> </h3>")
    else
      d3.selectAll("path.line").remove();
      d3.selectAll("text.linetext").remove();
      d3.select("#status").html("<h3></h3>")


  # ---
  # line Values
  # ---
  linevalues=(d) ->
    if d.id==selected[0]
      line(d.values)

  # ---
  # hover event
  # ---
  mouseover = (d) ->
    console.log(d);
    node.classed("bubble-hover", (p) -> p == d)
    console.log(d);
    d3.select("#status").html("<h3>The frequency of <span class=\"active\">#{d.word}</span> is <span class=\"active\">#{d.frequency}</span></h3>")


  # ---
  # remove hover class
  # ---
  mouseout = (d) ->
    node.classed("bubble-hover", false)
    d3.select("#status").html("<h3></h3>")

  # ---
  # public getter/setter for jitter variable
  # ---
  chart.jitter = (_) ->
    if !arguments.length
      return jitter
    jitter = _
    force.start()
    chart

  # ---
  # public getter/setter for height variable
  # ---
  chart.height = (_) ->
    if !arguments.length
      return height
    height = _
    chart

  # ---
  # public getter/setter for width variable
  # ---
  chart.width = (_) ->
    if !arguments.length
      return width
    width = _
    chart

  # ---
  # public getter/setter for radius function
  # ---
  chart.r = (_) ->
    if !arguments.length
      return rValue
    rValue = _
    chart
  
  # final act of our main function is to
  # return the chart function we have created
  return chart

# ---
# Helper function that simplifies the calling
# of our chart with it's data and div selector
# specified
# ---
root.plotData = (selector, data, plot) ->
  d3.select(selector)
    .datum(data)
    .call(plot)

texts = [
  {key:"wikinews",file:"wikinewsfreq.csv",word:"Wikinews"}
  {key:"Huffington",file:"huffingtonfreq.csv",word:"Huffington"}
  {key:"200701",file:"200701.csv",word:"200701"}
  {key:"200702",file:"200702.csv",word:"200702"}
  {key:"200703",file:"200703.csv",word:"200703"}
  {key:"200704",file:"200704.csv",word:"200704"}
  {key:"200705",file:"200705.csv",word:"200705"}
  {key:"200706",file:"200706.csv",word:"200706"}
  {key:"200707",file:"200707.csv",word:"200707"}
  {key:"200708",file:"200708.csv",word:"200708"}
  {key:"200709",file:"200709.csv",word:"200709"}
  {key:"200710",file:"200710.csv",word:"200710"}
  {key:"200711",file:"200711.csv",word:"200711"}
  {key:"200712",file:"200712.csv",word:"200712"}
  {key:"200801",file:"200801.csv",word:"200801"}
  {key:"200802",file:"200802.csv",word:"200802"}
  {key:"200803",file:"200803.csv",word:"200803"}
  {key:"200804",file:"200804.csv",word:"200804"}
  {key:"200805",file:"200805.csv",word:"200805"}
  {key:"200806",file:"200806.csv",word:"200806"}
  {key:"200807",file:"200807.csv",word:"200807"}
  {key:"200808",file:"200808.csv",word:"200808"}
  {key:"200809",file:"200809.csv",word:"200809"}
  {key:"200810",file:"200810.csv",word:"200810"}
  {key:"200811",file:"200811.csv",word:"200811"}
  {key:"200812",file:"200812.csv",word:"200812"}
  {key:"200901",file:"200901.csv",word:"200901"}
  {key:"200902",file:"200902.csv",word:"200902"}
  {key:"200903",file:"200903.csv",word:"200903"}
  {key:"200904",file:"200904.csv",word:"200904"}
  {key:"200905",file:"200905.csv",word:"200905"}
  {key:"200906",file:"200906.csv",word:"200906"}
  {key:"200907",file:"200907.csv",word:"200907"}
  {key:"200908",file:"200908.csv",word:"200908"}
  {key:"200909",file:"200909.csv",word:"200909"}
  {key:"200910",file:"200910.csv",word:"200910"}
  {key:"200911",file:"200911.csv",word:"200911"}
  {key:"200912",file:"200912.csv",word:"200912"}
  {key:"201001",file:"201001.csv",word:"201001"}
  {key:"201002",file:"201002.csv",word:"201002"}
  {key:"201003",file:"201003.csv",word:"201003"}
  {key:"201004",file:"201001.csv",word:"201001"}
  {key:"201005",file:"201005.csv",word:"201005"}
  {key:"201006",file:"201006.csv",word:"201006"}
  {key:"201007",file:"201007.csv",word:"201007"}
  {key:"201008",file:"201008.csv",word:"201008"}
  {key:"201009",file:"201009.csv",word:"201009"}
  {key:"201010",file:"201010.csv",word:"201010"}
  {key:"201011",file:"201011.csv",word:"201011"}
  {key:"201012",file:"201012.csv",word:"201012"}
  {key:"201101",file:"201101.csv",word:"201101"}
  {key:"201102",file:"201102.csv",word:"201102"}
  {key:"201103",file:"201103.csv",word:"201103"}
  {key:"201104",file:"201104.csv",word:"201104"}
  {key:"201105",file:"201105.csv",word:"201105"}
  {key:"201106",file:"201106.csv",word:"201106"}
  {key:"201107",file:"201107.csv",word:"201107"}
  {key:"201108",file:"201108.csv",word:"201108"}
  {key:"201109",file:"201109.csv",word:"201109"}
  {key:"201110",file:"201110.csv",word:"201110"}
  {key:"201111",file:"201111.csv",word:"201111"}
  {key:"201112",file:"201112.csv",word:"201112"}
  {key:"201201",file:"201201.csv",word:"201201"}
  {key:"201202",file:"201202.csv",word:"201202"}
  {key:"201203",file:"201203.csv",word:"201203"}
  {key:"201204",file:"201204.csv",word:"201204"}
  {key:"201205",file:"201205.csv",word:"201205"}
  {key:"201206",file:"201206.csv",word:"201206"}
  {key:"201207",file:"201207.csv",word:"201207"}
  {key:"201208",file:"201208.csv",word:"201208"}
  {key:"201209",file:"201209.csv",word:"201209"}
  {key:"201210",file:"201210.csv",word:"201210"}
  {key:"201211",file:"201211.csv",word:"201211"}
  {key:"201212",file:"201212.csv",word:"201212"}
  {key:"201301",file:"201301.csv",word:"201301"}
  {key:"201302",file:"201302.csv",word:"201302"}
  {key:"201303",file:"201303.csv",word:"201303"}
  {key:"201304",file:"201304.csv",word:"201304"}
  {key:"201305",file:"201305.csv",word:"201305"}
  {key:"201306",file:"201306.csv",word:"201306"}
  {key:"201307",file:"201307.csv",word:"201307"}
  {key:"201308",file:"201308.csv",word:"201308"}
  {key:"201309",file:"201309.csv",word:"201309"}
  {key:"201310",file:"201310.csv",word:"201310"}
  {key:"201311",file:"201311.csv",word:"201311"}
  {key:"201312",file:"201312.csv",word:"201312"}
  {key:"201401",file:"201401.csv",word:"201401"}
  {key:"201402",file:"201402.csv",word:"201402"}
  {key:"201403",file:"201403.csv",word:"201403"}
  {key:"201404",file:"201404.csv",word:"201404"}
  {key:"201405",file:"201405.csv",word:"201405"}
  {key:"201406",file:"201406.csv",word:"201406"}
  {key:"201407",file:"201407.csv",word:"201407"}
  {key:"201408",file:"201408.csv",word:"201408"}
  {key:"201409",file:"201409.csv",word:"201409"}
  {key:"201410",file:"201410.csv",word:"201410"}
]

# ---
# jQuery document ready.
# ---
$ ->
  # create a new Bubbles chart
  plot = Bubbles()

  # ---
  # function that is called when
  # data is loaded
  # ---
  display = (data) ->
    plotData("#vis", data, plot)

  # we are storing the current text in the search component
  # just to make things easy
  key = decodeURIComponent(location.search).replace("?","")
  text = texts.filter((t) -> t.key == key)[0]

  # default to the first text if something gets messed up
  if !text
    text = texts[0]

  # select the current text in the drop-down
  $("#text-select").val(key)

  # bind change in jitter range slider
  # to update the plot's jitter
  d3.select("#jitter")
    .on "input", () ->
      plot.jitter(parseFloat(this.output.value))

  # bind change in drop down to change the
  # search url and reset the hash url
  d3.select("#text-select")
    .on "change", (e) ->
      key = $(this).val()
      location.replace("#")
      location.search = encodeURIComponent(key)

  # set the book title from the text word
  d3.select("#book-title").html(text.word)

  # load our data
  d3.csv("data/#{text.file}", display)

