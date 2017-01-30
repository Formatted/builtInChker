var Nightmare = require('nightmare');       
var nightmare = Nightmare({ show: true });
var Promise = require('promise');
var fs = require("fs");

var nextPage = '';
var bIC = 'http://www.builtincolorado.com/jobs#/jobs?f%5B%5D=im_job_categories%3A78&f%5B%5D=sm_field_job_city%3AGreater+Denver+Area' 
var jobs = [];

var sBiC = function(boo) {
    fs.createReadStream('list.txt').pipe(fs.createWriteStream('oldList.txt'));
    nightmare
    .goto(boo)
    .wait(3000)
    .evaluate(function () {
        // return document.querySelector('.views-field-nothing > .field-content > .job-title > a').text;
        // return document.getElementsByClassName('job-title').href;
        var asd = [];
        var list = document.querySelectorAll('.views-field-nothing');
        list.forEach(function(e){
            asd.push(e.innerText.split('\n'));
        })
        nextPage = document.querySelector('.pager-next > a').href;
        return [asd, nextPage];
        
    })
    .then(function (result) {
        // console.log(JSON.stringify(result));
        // console.log(result[0]);
        // console.log(result[1]);
        result[0].splice(0, 3);
        jobs.push(result[0]);
        nextPage = result[1];
        // console.log(nextPage);
        nightmare
            .goto(nextPage)
            .wait(3000)
            .evaluate(function () {
                // return document.querySelector('.views-field-nothing > .field-content > .job-title > a').text;
                // return document.getElementsByClassName('job-title').href;
                var asd = [];
                var list = document.querySelectorAll('.views-field-nothing');
                list.forEach(function(e){
                    asd.push(e.innerText.split('\n'));
                })
                nextPage = document.querySelector('.pager-next > a').href;
                return [asd, nextPage];
                
            })
            .end()
            .then(function (result) {
                result[0].splice(0, 3);
                jobs.push(result[0]);
                // console.log(jobs);

                require("fs").writeFile(
                    'list.txt',
                    jobs[0].map( item => item + '\n') + ' --- ' + '\n' +
                    jobs[1].map( item => item + '\n'),
                    function (err) { console.log(err ? 'Error :'+err : 'ok') }
                );
                console.log("done");

            })
            .then( foo => boogo())
        })
    .catch(function (error) {
        console.error('Search failed:', error);
    });
}
// returns 1st and second page of results as [ [ ['job title', 'company', ''] ]  ]
// first 3 are Featured + 20 recently posted
sBiC(bIC);

// [ [ [ 'QE Engineer', 'Layer3 TV', '' ],
//     [ 'IoT Full-Stack DeveloperNEW', 'HomeAdvisor', '' ],
//     [ 'Software Engineering ManagerNEW', 'HomeAdvisor', '' ]
//   ],
//   [ [ 'DevOps Engineer', 'Healthgrades', '' ],
//     [ 'Web Developer', 'Convercent', '' ],
//     [ 'Applications Engineer', 'Arrow Electronics, Inc.', '' ],
//   ]
// ]
var boogo = function(){
    var oldL = [];
    var newL = [];
    var newJ = 0;
    require("fs").readFile('list.txt', 'utf8', function(err, gege){
        // console.log(gege.split('\n')[0]);
        newL = gege.split('\n');

        require("fs").readFile('oldList.txt', 'utf8', function(err, gege){
        // console.log(gege.split('\n')[0]);
        oldL = gege.split('\n');
        var oldLL = ',' + oldL[0];
        console.log('Numbe of new postings: ', newJJ(oldLL, newL, 0))
          

    });

    });

}

var newJJ = function(oldList, newList, numberOfNew){
    if(numberOfNew === 0){
        if(oldList === ',' + newList[numberOfNew]){
            return "no new postings";
        }
    }
    if(newList[numberOfNew] === oldList){
        return numberOfNew;
    } else {
        numberOfNew += 1;
        return newJJ(oldList, newList, numberOfNew);
    }
}
