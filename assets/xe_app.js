var APP_URL = "https://designer.theprintgarage.com.au/designer/";
//Start Name and number 
//End Name and number 

//Get encrypted key
var secretKeyData = "";
$.get(APP_URL+'api/v1/secretkey',function(html){
    secretKeyData = JSON.parse(html);
  });

/**
* Get encrypted order data string.
*
* @param {string} urlToEncode - order data string
* @param {string} secretKey - secret key
*/
function encrypt(urlToEncode, secretKey) {
  let enCodedBit, encryptedTxt = '', cipherKey = '5';
  urlToEncode += secretKey;
   for (let i = 0; i < urlToEncode.length; i++) {
    enCodedBit = String.fromCharCode(urlToEncode[i].charCodeAt(0) + cipherKey.charCodeAt(0));
    encryptedTxt += enCodedBit;
    }
    encryptedTxt = (btoa(encryptedTxt))
    return encryptedTxt;
  }

$(document).ready(function() {
  var editCart = 0;
//   getting cart settings from Imprint admin here
  $.get(APP_URL + "api/v1/settings/carts", function(result) {
    if(result){
      var response = JSON.parse(result); 
      if (response.is_enabled){
        editCart = 1;
         $(".design-edit-link").css("display", "block");
      }  
      }
      });

// Name number data
  // Get the modal
  
  $(".nnlink").each(function() {
    var nnobj = $(this);
     var ref_id = nnobj.attr('data-refid');
    $.get(APP_URL + "api/v1/carts/isNameNum?design_id="+ref_id,function(data){
      
      if(data.name_number){
        nnobj.show();
        console.log(data.name_number);
      }
      
    });
    
  }); 
  
  $(".nnlink").click(function() {
    var nnobj = $(this);
     var ref_id = nnobj.attr('data-refid');
     var varId = nnobj.attr('data-varId');
      $.get(APP_URL + "api/v1/carts/nameNumber?design_id="+ref_id+"&variant_id="+varId,function(data){
          if(data!=undefined){
            var tableContent = ' <span class="close">&times;</span><table><tr>';
            $.each(data.fields,function(hKey, heading){
              tableContent += "<th>"+heading+"</th>";
            });
            tableContent += "</tr>";
            $.each(data.values,function(rKey, row){
              tableContent += "<tr>";
              $.each(row,function(cKey, content){
                if(content.toString().indexOf("http") > -1){
                   tableContent += '<td><img src="'+content+'" width="50" height="50"></td>';
                }else{
                  tableContent += "<td>"+content+"</td>";
                }
              });
              tableContent += "</tr>";
            });
            tableContent += "</table>";
            $('.nnmodal-content').html(tableContent);
            $("#nnModal").show();
         }
     });
   }); 
  //var modal = document.getElementById("nnModal");
  //$(document).on('click','.close',function(){
  //  $("#nnModal").hide();
 // });
 
//var span = document.getElementsByClassName("close")[0];
//span.onclick = function() {
//  modal.style.display = "none";
//}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
  
   // Name number data
//   image replace for customized items here
  $(".ref-preview-img").each(function() {     
    var obj = $(this);
     var ref_id = obj.attr('data-ref-id');
     var varId = obj.attr('data-varId');
        var size = '';
        var spid = '';
        var encParam = ref_id + "@" + varId + "@";
       var token = encrypt(encParam, secretKeyData);
      $.get(APP_URL + "api/v1/preview-images?token="+token,function(data){
        if(ref_id!=undefined){
            $.each(data,function(key, val){  
              if(key==ref_id && val.length>0){                                   
                 $.each(val,function(imgKey, imgObj){  
                  var newElement = '<li  class="product-image product-thumb customize-image" title="">'+'<img src="'+imgObj['customImageUrl'][imgKey]+'" width="75" height="75" alt="" rel="'+ref_id+'" style="display:block;" class="previewimg">'+'</li>';
                  //arr.push(newElement);
                  $(obj).append(newElement);
                  $(obj).find('span').remove();
                  // hide name and number info link
                   if(imgObj['nameAndNumber'] == 0){
                     jQuery(".nninfo_"+key).hide();
                   }
                 //show custom size in variable boundary.
                 if(imgObj['variableDecorationSize']){
                  $(obj).append('<li>custom '+imgObj['sizeAttr']+': '+ imgObj['variableDecorationSize'] + ' ' + imgObj['variableDecorationUnit'] +'</li>');
                 }
                });
              }
            });
      } 
  });
});
       /**
        * Get encrypted order data string.
        *
        * @param {string} urlToEncode - order data string
        * @param {string} secretKey - secret key
        */
        function encrypt(urlToEncode, secretKey) {
            let enCodedBit, encryptedTxt = '', cipherKey = '5';
            urlToEncode += secretKey;

            for (let i = 0; i < urlToEncode.length; i++) {
                enCodedBit = String.fromCharCode(urlToEncode[i].charCodeAt(0) + cipherKey.charCodeAt(0));
                encryptedTxt += enCodedBit;
            }
            encryptedTxt = (btoa(encryptedTxt))
            return encryptedTxt;
        }
// cart edit content here
  
  $.getJSON('/cart.js', function(cartData) {
      if(cartData){
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
         $.each(cartData.items,function(key, item){
           var editURL = '';    
           var pid = '';
           var dpid = '';
           var thisPid = '';
           var thisVid = '';
           var vid = '';
           var qty = '';
           var sku = '';
           var cart_item_id = '';
           var ids = '';
           
             var custID = 0 ;
            
           thisPid = item.product_id;
           thisVid = item.variant_id;
           dpid = item.properties._refid;
           qty = item.quantity;
           cart_item_id = (key+1);
           $.get(APP_URL+'api/v1/secretkey',function(html){
             var secretKeyData = JSON.parse(html);
           })
           $.get(APP_URL + "api/v1/shopify-product/"+thisVid,function(orgid){
             var ids = JSON.parse(orgid);
              pid = ids.pid;
              vid = ids.vid;
              var urlparam = 'customer='+custID+'&id='+pid+'&vid='+vid+'&dpid='+dpid+'&qty='+qty+'&cart_item_id='+cart_item_id;
              var encryptUrl = encrypt(urlparam, secretKeyData);
             $.get(APP_URL + "api/v1/carts/set-delivery-option?old_varID="+vid+"&new_varID="+thisVid,function(data){
                  console.log(data);
              });
             if (isMobile || navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
                   editURL= APP_URL+'mobile/index.html?'+ encryptUrl;
               } else{
                   editURL = '/pages/designer-studio?'+ encryptUrl;
               }
             var itemKey = item.key;
             var selector = itemKey.replace(":", "\\:")
             $('#'+selector).attr("href", editURL);
            
          });
           
         });
      }
} );
  
 
});

/*
Utility function to allow for simple query string lookups
*/
function queryString()
{
   // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var varss = query.split("&");
    var vars = varss[1].split("--");
    
  
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  
  return query_string;
}



function addItem()
{
    var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
//   var url = new URL(url_string);
//   var c = url.searchParams.get("c");
  

   // var vars = varss[1].split("--");

   
   for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
         // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
   }
  
      
    //  
    if(query_string.edit && query_string.edit != ""){
      var deleteItem = query_string.edit; 
      CartJS.removeItem(deleteItem);
    }
      /* Ref URL Parts
          0: Imprint design ref ID
          1: shopify variant id
          2: quantity ordered   
          3: parent_variant ID
      */
        //get potential of multiple items
        var items = query_string.ref.split('--');
      var itemNum = (items.length)-1;
      //console.log(itemNum);
      var waiting = 3000;
         if(itemNum > 4){
                    waiting = (itemNum/2)*3000;
                  }

       // alert(Querys.ref.split('--'));
         // return false ;
     
      
          //loop through items
             
            
           for(var i in items)
            {    
               var this_item =items[i].split('-');
               //console.log(this_item[1],this_item[2],this_item[0]);
              
                var properties = {};
                if(this_item[0] != 0){
                  properties = {'_refid': this_item[0],'_parent_var_id': this_item[3] };
                }
                   CartJS.addItem(this_item[1],this_item[2], properties, {

                // Define a success callback to display a success message.
                "success": function(data, textStatus, jqXHR) {
                    $('#info').addClass('message-success');
                    $('#info').html('Redirecting to the cart.....Please Wait.');
                 
                  if(i == itemNum){
                    setTimeout(function() { window.location.href = '/cart';}, waiting);
                                         
                  }
                  
                },

                // Define an error callback to display an error message.
                "error": function(jqXHR, textStatus, errorThrown) {
                    $('#info').addClass('message-error');
                   $('#info').html('There was a problem adding to the cart! <br><p style="color:black;"> Attempting cart addition again...<p>');
                   setTimeout(function(){
                      location.reload();
                  },2000);
                }
            });  
         }
}

function ref_add_to_cart()
{
  alert(typeof qsLookup.ref);
  
    if(typeof qsLookup.ref != "undefined")
  {
      /* Ref URL Parts
          0: riaxe design ref ID
          1: shopify variant id
          2: quantity ordered     
      */
    
        //get potential of multiple items
        var this_item,items = qsLookup.ref.split('--');
      
        //loop through items
        for(var i in items)
        {        
          //unpack item
          this_item = items[i].split('-');
      
      //TODO: validate item
        
          //add the item
          $.ajax({
            type: "POST",
            url: '/cart/add.js',
            data: {
              quantity: this_item[2],
              id: this_item[1],
        async: false,
              properties: {
                '_refid': this_item[0]
              }
            },
            dataType: "json",
            success: function(resp)
            {
              $("#info").html("Item Added!");
            }
          });
        }      
      
     window.location.href = '/cart';
    }
    else
    {
      //TODO: error handling 
      $("#info").html("Error!");
    }
}

function reorderfromImprint(orderID, elem){
  $(elem).text("Processing...");
  $(elem).prop("onclick", null);
  var cartForm = new FormData();
  cartForm.append("orderID", orderID);
  
  var postSettings = {
    "url": APP_URL + "api/v1/reorder",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": cartForm
  };
  
  $.ajax(postSettings).done(function (response) {
    const cartObj = JSON.parse(response);
    if(cartObj.status && cartObj.cart_link != ""){
      window.location.href = cartObj.cart_link;
    }else{
      alert("The items of this order are either out of stock or the order designs are not saved");
      $(elem).text("Reorder");
    }
    console.log(cartObj.status);
  });
  //alert(orderID);
}



