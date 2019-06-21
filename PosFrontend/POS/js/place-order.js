var qtyArr = [];
var items = [];
var orderId;

function getDate(){
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = d.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return output;
}

$(document).ready(function () {

    $.ajax({
        method:"GET",
        url:"http://localhost:8080/api/v1/orders?maxid=true",
        async:true
    }).done(function (data) {
        console.log("id - "+data);
        $("#order-id").val(data);
        addOrder(data);
    })
    });

    $.ajax({
        method:"GET",
        url:"http://localhost:8080/api/v1/customers",
        async:true
    }).done(function (customers) {
        for (var i = 0; i < customers.length; i++) {
            $('#cusdroplist').append('<option value="' + customers[i].id + '">' + customers[i].id + '</option>');
        }
    })
        .fail(function (errorThrown) {
            console.log(errorThrown);
        });

    $.ajax({
        method:"GET",
        url:"http://localhost:8080/api/v1/items",
        async:true
    }).done(function (items1) {
        items = items1;
        for (var i = 0; i < items1.length; i++) {
            qtyArr[i] = items1[i].qty;
            $('#itmdroplist').append('<option value="' + items1[i].code + '">' + items1[i].code + '</option>');
        }
    })
        .fail(function (errorThrown) {
            console.log(errorThrown);
        });

});

function forItemDropdown() {

    $.ajax({
        method:"GET",
        url:"http://localhost:8080/api/v1/items",
        async:true
    }).done(function (items1) {
        $('#itmdroplist').css('box-shadow', '1px 2px 5px  #0069d9');
        var selectedID = $('#itmdroplist :selected').text();
        var selecetedItemName;
        var selectItemprice;
        for (var i = 0; i < items1.length; i++) {
            if (selectedID === items1[i].code) {
                selecetedItemName = items1[i].description;
                selectItemprice = items1[i].price;
                selectedItemQtyonHand = items1[i].qty;
            }
        }
        $('#OrdItmName').val(selecetedItemName);
        $('#OrdItmPrice').val(selectItemprice);
        $('#OrdQuantityOnHand').val(selectedItemQtyonHand);

    }).fail(function (errorThrown) {
        console.log(errorThrown);
    });
}

$('#cusdroplist').click(function () {

    $.ajax({
        method:"GET",
        url:"http://localhost:8080/api/v1/customers",
        async:true
    }).done(function (customers) {
        $('#cusdroplist').css('box-shadow', '1px 2px 5px  #0069d9');
        var selectedID = $('#cusdroplist :selected').text();
        var selectedName;
        for (var i = 0; i < customers.length; i++) {
            if (selectedID === customers[i].id) {
                selectedName = customers[i].name
            }
        }
        $('#CusName').val(selectedName);
    })


});

var selectedItemQtyonHand;

$('#itmdroplist').click(function () {
    forItemDropdown();
});

$('#OrdQuantity').change(function () {
    $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #0069d9');
    var itemQuentity = $('#OrdQuantity').val();
    if (selectedItemQtyonHand < itemQuentity) {
        $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #b80009');
        $('#OrdQuantity').val("");
        //$('#exampleInputQuantity').css('box-shadow','1px 2px 5px  #0069d9');
    } else {
        $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #0069d9');
    }
});

$('#OrdQuantityOnHand').change(function () {
    $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #0069d9');
    var itemQuentity = $('#OrdQuantity').val();
    if (selectedItemQtyonHand < itemQuentity) {
        $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #b80009');
        $('#OrdQuantity').val("");
        //$('#exampleInputQuantity').css('box-shadow','1px 2px 5px  #0069d9');
    } else {
        $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #0069d9');
    }
});

var total =0;

$('#OrdAddItem').click(function () {
    var valid = true;
    if ($('#CusName').val().length === 0) {
        $('#cusdroplist').css('box-shadow', '1px 2px 5px  #b80009');
        valid = false;
    }
    if ($('#OrdItmName').val().length === 0) {
        $('#itmdroplist').css('box-shadow', '1px 2px 5px  #b80009');
        valid = false;
    }
    if ($('#OrdQuantity').val().length === 0) {
        $('#OrdQuantity').css('box-shadow', '1px 2px 5px  #b80009');
        valid = false;
    }

    if (valid) {
        var itemCode = $('#itmdroplist :selected').text();
        var itemDescription = $('#OrdItemName').val();
        var itemPrice = $('#OrdItmPrice').val();
        var getQuantity = $('#OrdQuantity').val();

        if ($('tbody tr').length === 1) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].code === itemCode) {
                    items[i].qty = items[i].qty - getQuantity;
                    $('#OrdQuantityOnHand').val(items[i].qty);
                    console.log(getQuantity)
                }
            }
            $('tbody').append('<tr><td>' + itemCode + '</td><td>' + itemDescription + '</td><td>' + getQuantity + '</td><td>' + itemPrice + '</td><td><img src="https://img.icons8.com/material/24/000000/delete.png"></td></tr>');

            //delete function
            $('tbody tr td img').click(function () {
                var qty = $(this).parents('tr').find('td:nth-child(3)').text();
                var code = $(this).parents('tr').find('td:nth-child(1)').text();
                for (var k = 0; k < items.length; k++) {
                    if (code === items[k].code) {
                        items[k].qty = items[k].qty + parseInt(qty);
                        $(this).parents('tr').remove();
                    }
                }
                $('#OrdQuantity').val('');
            });
            //update function
            // $('tbody tr').off('click');
            $('tbody tr').click(function () {
                var t = $(this);
                var code = $(this).find('td:nth-child(1)').text();
                var quantity = $(this).find('td:nth-child(3)').text();
                var i;
                for (i = 0; i < items.length; i++) {
                    if (items[i].code === code) {
                        $('#itmdroplist').val(code);
                        $('#itmdroplist').val(items[i].code);
                        $('#OrdItemName').val(items[i].description);
                        $('#OrdQuantityOnHand').val(items[i].qty);
                        $('#OrdItemPrice').val(items[i].price);
                        $('#OrdQuantity').val(quantity);
                        break;
                    }
                }
                $('#OrdAddItem').prop('disabled', true);
                $('#OrdUpdateItem').prop('disabled', false);
                $('#OrdUpdateItem').click(function () {
                    var qty = $('#OrdQuantity').val();
                    t.find('td:nth-child(3)').replaceWith('<td>' + qty + '</td>');
                    if (parseInt(qty) < parseInt(quantity)) {
                        var test = items[i].qty + parseInt(quantity) - parseInt(qty);
                        if (test < 0) {
                            $('#OrdQuantity').val('');
                        }
                        else {
                            items[i].qty = test;
                            $('#OrdQuantity').val(items[i].qty);
                        }
                    }
                    else if (qty > parseInt(quantity)) {
                        var test = items[i].qty + parseInt(quantity) - parseInt(qty);
                        if (test < 0) {
                            $('#OrdQuantity').val('');
                        }
                        else {
                            items[i].qty = test;
                            $('#OrdQuantity').val(items[i].qty);
                        }
                    }
                    $('#OrdUpdateItem').prop('disabled', true);
                    $('#OrdAddItem').prop('disabled', false);
                });
            });

            $('#itmdroplist').focus();
        }
        else {
            var l = 0;
            $('tbody tr td:first-child').each(function () {
                if ($(this).html() === itemCode) {
                    var newQty = parseInt($(this).parents("tr").find('td:nth-child(3)').html()) + parseInt(getQuantity);

                    for (var p = 0; p < items.length; p++) {
                        if (items[p].code === itemCode && items[p].qtyOnHand > getQuantity) {
                            items[p].qty = items[p].qty - getQuantity;
                            $('#OrdQuantityOnHand').val(items[p].qty);
                            $(this).parents("tr").find('td:nth-child(3)').replaceWith('<td>' + newQty + '</td>');
                            $('#itmdroplist').focus();
                        }
                    }
                    ++l;
                }
            });
            console.log(l);
            if (l === 0) {
                for (var k = 0; k < items.length; k++) {
                    if (items[k].code === itemCode) {
                        items[k].qty = items[k].qty - getQuantity;
                        $('#OrdQuantityOnHand').val(items[k].qty);
                    }
                }

                $('tbody').append('<tr><td>' + itemCode + '</td><td>' + itemDescription + '</td><td>' + getQuantity + '</td><td>' + itemPrice + '</td><td><img src="https://img.icons8.com/material/24/000000/delete.png"></td></tr>');
                //delete function
                $('tbody tr td img').off('click');
                $('tbody tr td img').click(function () {
                    var qty = $(this).parents('tr').find('td:nth-child(3)').text();
                    var code = $(this).parents('tr').find('td:nth-child(1)').text();
                    for (var k = 0; k < items.length; k++) {
                        if (code === items[k].code) {
                            items[k].qty = items[k].qty + parseInt(qty);
                            $(this).parents('tr').remove();
                        }
                    }
                });
                $('#itmdroplist').focus();

                //update function

                $('tbody tr').off('click');
                $('tbody tr').click(function () {
                    var t = $(this);
                    var code = $(this).find('td:nth-child(1)').text();
                    var quantity = $(this).find('td:nth-child(3)').text();
                    var i;
                    for (i = 0; i < items.length; i++) {
                        if (items[i].code === code) {
                            $('#itmdroplist').val(code);
                            $('#itmdroplist').val(items[i].code);
                            $('#OrdItemName').val(items[i].description);
                            $('#OrdQuantityOnHand').val(items[i].qty);
                            $('#OrdItemPrice').val(items[i].price);
                            $('#OrdQuantity').val(quantity);
                            break;
                        }
                    }
                    $('#OrdAddItem').prop('disabled', true);
                    $('#OrdUpdateItem').prop('disabled', false);

                    $('#OrdUpdateItem').off('click');
                    $('#OrdUpdateItem').click(function () {
                        var qty = $('#OrdQuantity').val();
                        t.find('td:nth-child(3)').replaceWith('<td>' + qty + '</td>');
                        if (parseInt(qty) < parseInt(quantity)) {
                            var test = items[i].qty + parseInt(quantity) - parseInt(qty);
                            if (test < 0) {
                                $('#OrdQuantityOnHand').val('');
                            }
                            else {
                                items[i].qty = test;
                                $('#OrdQuantityOnHand').val(items[i].qty);
                            }
                        }
                        else if (qty > parseInt(quantity)) {
                            var test = items[i].qty + parseInt(quantity) - parseInt(qty);
                            if (test < 0) {
                                $('#OrdQuantityOnHand').val('');
                            }
                            else {
                                items[i].qty = test;
                                $('#OrdQuantityOnHand').val(items[i].qty);
                            }
                        }
                        $('#OrdUpdateItem').prop('disabled', true);
                        $('#OrdAddItem').prop('disabled', false);
                    });
                });
            }
        }
    }
});

function addOrder(orderId) {
    $("#addOrder").click(function () {

        var id = $("#order-id").val();
        var orderItemDTOS = [];
        var i=0;
        var selectedID = $('#cusdroplist :selected').text();

        var detailsDTO = {
            orderid:id,
            cusid:selectedID,
            orderdate:getDate()
        };
        //detailsDTO.push(orderId,selectedID,getDate());

        while($("tbody tr").length >i){
            i++;

            var code = $("tbody tr:nth-child("+i+") td:nth-child(1)").text();
            var qty = $("tbody tr:nth-child("+i+") td:nth-child(3)").text();

            var obj = {
                orderid:orderId,
                itemcode:code,
                qty:qty
            };
            orderItemDTOS.push(obj);
        }

        var allAr = {
            detailsDTO:detailsDTO,
            orderItemDTOS:orderItemDTOS
        };

        $.ajax({
            method:"POST",
            url:"http://localhost:8080/api/v1/orders",
            async:true,
            contentType: 'application/json',
            data:JSON.stringify(allAr)
        }).done(function (response) {
            alert("Order Saved");
            $('#OrdItemName').val('');
            $('#OrdQuantityOnHand').val('');
            $('#OrdItemPrice').val('');
            $('#OrdQuantity').val('');
            $("#order-id").val(++id);

        })
            .fail(function (error) {
                console.log("unable to make order");
            });
    });
}