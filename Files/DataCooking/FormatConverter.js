/**
 * Created by leejaehoon on 13. 11. 17..
 */
function convertFormat(data)
{
    var domain_x = {}
    data.forEach(function(d)
    {
        if(typeof domain_x[d.year] == "undefined")
        {
            domain_x[d.year] = {};
        }
        domain_x[d.year][d.age] =  d.people;
    });

    var convertedData = [];
    d3.keys(domain_x).forEach(function(year)
    {
        domain_x[year]['year'] = year;
        convertedData.push(domain_x[year]);
    });

    return convertedData;
}