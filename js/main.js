async function loadData(url) {
    const data = await d3.csv(url)
    return prepData(data)
}

function loadChart(id) {
    return d3.select(`#${id}`)
}

function setCityCount(number) {
    d3.select('#city-count').text(number)
}

function prepData(data) {
    return data
        .filter(({ eu }) => eu === 'true')
        .map(({ population, x, y, ...rest }) => ({ population: +population, x: +x, y: +y, ...rest }))
}

function drawCircles(data, chart, baseRadius = 4, sizeCutOff = 1_000_000) {
    chart.selectAll()
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'city')
        .attr('cx', ({ x }) => x)
        .attr('cy', ({ y }) => y)
        .attr('r', ({ population }) => (population > sizeCutOff ? baseRadius * 2 : baseRadius))
        .attr('fill', 'red')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

    chart.selectAll()
        .data(data.filter(({ population }) => population > sizeCutOff))
        .enter()
        .append('text')
        .attr('class', 'city-label')
        .attr('x', ({ x }) => x)
        .attr('y', ({ y }) => y - baseRadius * 3)
        .text(({ city }) => city)
}

async function main() {
    const chart = loadChart('chart')
    const cities = await loadData(
        'https://raw.githubusercontent.com/UBC-InfoVis/datasets/master/cities_and_population.csv'
    )

    setCityCount(cities.length)
    drawCircles(cities, chart)
}

main()