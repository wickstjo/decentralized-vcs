function render(config, query = '') {
   body();
   content(config, query);
}

// ADD HTML CONTENT
function body() {

   // GENERATE PARENT SELECTOR
   var files = '<div id="files-outer"><div id="files"></div></div>';
   var footer = '<div id="footer">Cannot locate IPFS directory</div>';

   // RENDER THEM IN
   $('#content-body').html(files + footer);
}

// ADD GENERATED CONTENT
function content(config, query) {

   // FETCH MODULES
   var immutable = require('../modules/immutable.js');
   var moment = require('moment');

   // PLACEHOLDERS
   var dir = '';
   var back_button = false;

   // IF NOTHING IS REQUESTED, OPEN ROOT HASH & DISABLE BACK BUTTON
   if (query == '' || query == config.latest.hash) {
      dir = config.latest.hash;
      back_button = false;
   } else {
      dir = query;
      back_button = true;
   }

   // OPEN DIRECTORY
   immutable.dir(dir).then((content) => {

      // ALL ENTRY ROWS
      var rows = '';

      // GENERATE HEADER
      var header = `
         <tr id="current">
            <td><div>
               <table><tr>
                  <td id="location">` + headerify(dir) + `</td>
               </tr></table>
            </div></td>
         </tr>
      `;

      // CONCAT HEADER TO ROWS
      rows += header;

      // LOOP THROUGH ONCE
      content.forEach((entry) => {
         
         // IF ENTRY IS A DIRECTORY
         if (entry.type == 'dir') {

            // GENERATE ROW
            var row = `
               <tr id="header">
                  <td><a id="open" hash="` + entry.path + `"><div>
                     <table><tr>
                        <td>` + entry.name + `/</td>
                        <td>` + entry.hash + `</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;

            // APPEND ROW TO ROWS
            rows += row;
         }
      });

      // THEN LOOP AGAIN
      content.forEach((entry) => {
         
         // IF ENTRY IS A FILE
         if (entry.type == 'file') {

            // GENERATE ROW
            var row = `
               <tr id="content">
                  <td><a id="show" hash="` + entry.path + `"><div>
                     <table><tr>
                        <td>` + entry.name + `</td>
                        <td>` + entry.hash + `</td>
                     </tr></table>
                  </div></a></td>
               </tr>
            `;

            // APPEND ROW TO ROWS
            rows += row;
         }
         
      });

      // ADD BACK BUTTON IF NOT IN ROOT
      if (back_button == true) {

         var parent = query.split('/');
         parent.pop();
         parent = parent.join('/');

         var go_back = `
            <tr id="back">
               <td><a id="open" hash="` + parent + `"><div>
                  <table><tr>
                     <td>Back</td>
                  </tr></table>
               </div></a></td>
            </tr>
         `;

         rows += go_back;
      }

      // CONSTRUCT FULL TABLE
      var table = '<table>' + rows + '</table>';

      // GENERATE FOOTER
      var footer = '<a href="https://ipfs.io/ipfs/' + dir + '" target="_blank">Version ' + config.latest.name + ' &nbsp;&ndash;&nbsp; ' + moment.unix(config.latest.timestamp).format('DD/MM @ HH:mm') + '</a>';

      // FADE IN BOTH
      fadeIn('files', table);
      fadeIn('footer', footer);
   });
}

// EXPORT RENDER AND CONTENT FUNCTIONS AS MODULES
module.exports = {
   render: render,
   content: content
}