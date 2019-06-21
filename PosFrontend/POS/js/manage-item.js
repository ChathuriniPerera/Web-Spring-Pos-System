
function getCurrentCode(){
    var lastCode = $('tbody tr:last-child td:first-child').text();
    console.log(lastCode);
    var newCode = 'I00'+(parseInt(lastCode.substring(1))+1);
    return newCode;
}

$(document).ready(function () {
    $('#itmQuantity').change(function () {
        $('#itmQuantity').css('box-shadow','1px 2px 5px  #0062cc');
    });
    $('#itmDescription').change(function () {
        $('#itmDescription').css('box-shadow','1px 2px 5px  #0062cc');
    });
    $('#itmPrice').change(function () {
        $('#itmPrice').css('box-shadow','1px 2px 5px  #0062cc');
    });

    $.ajax({
        method:"GET",
        url:"http://localhost:8080/api/v1/items",
        async:true
    }).done(function (items) {
        for (var i=0; i<items.length; i++){
            $('tbody').append('<tr><td>'+("I"+items[i].code)+'</td><td>'+items[i].description+'</td><td>'+items[i].qty+'</td><td>'+items[i].price+'</td><td><img src="https://img.icons8.com/material/24/000000/delete.png"></td></tr>');
        }

        $('#ItemCode').val(getCurrentCode());
        $('#itmDescription').focus();

        //update
        $('tbody tr').click(function () {
            var th = $(this);
            var valid =true;

            var code = $(this).find('td:nth-child(1)').text();
            var description = $(this).find('td:nth-child(2)').text();
            var qty = $(this).find('td:nth-child(3)').text();
            var price = $(this).find('td:nth-child(4)').text();

            $('#ItemCode').val(code);
            $('#itmDescription').val(description);
            $('#itmQuantity').val(qty);
            $('#itmPrice').val(price);

            $('#addItem').replaceWith('<button id="updateItem" type="button" class="btn btn-primary">Update Item</button>');
            $('#updateItem').off('click');
            $('#updateItem').click(function () {

                if ($.trim($('#itmDescription').val()).length === 0) {
                    $('#itmDescription').css('box-shadow','1px 2px 5px  #b80009');
                    valid = false;
                }
                if ($.trim($('#itmPrice').val()).length === 0) {
                    $('#itmPrice').css('box-shadow','1px 2px 5px  #b80009');
                    valid = false;
                }
                if ($.trim($('#itmQuantity').val()).length === 0) {
                    $('#itmQuantity').css('box-shadow','1px 2px 5px  #b80009');
                    valid = false;
                }

                if (valid){
                    th.find('td:nth-child(2)').replaceWith('<td>'+$('#itmDescription').val()+'</td>');
                    th.find('td:nth-child(3)').replaceWith('<td>'+$('#itmQuantity').val()+'</td>');
                    th.find('td:nth-child(4)').replaceWith('<td>'+$('#itmPrice').val()+'</td>');

                    $.ajax({
                        method:"PUT",
                        url:"http://localhost:8080/api/v1/items/"+code.substring(1),
                        async:true,
                        contentType: 'application/json',
                        data:JSON.stringify({
                            description:$('#itmDescription').val(),
                            qty:$('#itmQuantity').val(),
                            price:$('#itmPrice').val()
                        })
                    }).done(function (data) {
                        alert("Item Updated Successfully");
                    }).fail(function (error) {
                        alert("Item can't update");
                    });

                    $('#itmDescription').val('');
                    $('#itmQuantity').val('');
                    $('#itmPrice').val('');

                    $('#updateItem').replaceWith('<button id="addItem" type="button" class="btn btn-primary">Add Item</button>');
                    $('#ItemCode').val(getCurrentCode());
                    $('#itmDescription').focus()
                }

            });
        });

        //delete
        $('tbody tr td:last-child img').click(function () {
            var d = $(this).parents('tr').find('td:nth-child(1)').text();
            var addbtn = $("#addItem").clone(true);
            console.log(d);
            if (confirm("Do you really want to delete?")){
                var t = $(this).parents('tr');

                $.ajax({
                    method:"DELETE",
                    url:"http://localhost:8080/api/v1/items/"+d.substring(1),
                    async:true
                }).done(function (data) {
                    alert("Customer Deleted Successfully");
                    t.remove();

                    $('#itmDescription').focus();

                    $("#ItemCode").val(getCurrentCode());
                    $('#itmDescription').val('');
                    $('#itmQuantity').val('');
                    $('#itmPrice').val('');

                    $("#updateItem").replaceWith(addbtn);

                }).fail(function (error) {
                    alert("Item can't delete");

                    $('#itmDescription').focus();

                    $("#ItemCode").val(getCurrentCode());
                    $('#itmDescription').val('');
                    $('#itmQuantity').val('');
                    $('#itmPrice').val('');

                    $("#updateItem").replaceWith(addbtn);
                });
            }
        });



    })

});

$('#addItem').click(function () {
    var valid = true;
    if ($.trim($('#itmDescription').val()).length === 0) {
        $('#itmDescription').css('box-shadow','1px 2px 5px  #b80009');
        valid = false;
    }
    if ($.trim($('#itmPrice').val()).length === 0) {
        $('#itmPrice').css('box-shadow','1px 2px 5px  #b80009');
        valid = false;
    }
    if ($.trim($('#itmQuantity').val()).length === 0) {
        $('#itmQuantity').css('box-shadow','1px 2px 5px  #b80009');
        valid = false;
    }
    if (valid){
        var code = $('#ItemCode').val();
        var description = $('#itmDescription').val();
        var quantity = $('#itmQuantity').val();
        var price = $('#itmPrice').val();

        $('tbody').append('<tr><td>'+code+'</td><td>'+description+'</td><td>'+quantity+'</td><td>'+price+'</td><td><img src="https://img.icons8.com/material/24/000000/delete.png"></td></tr>');

        $.ajax({
            method:"POST",
            url:"http://localhost:8080/api/v1/items",
            async:true,
            contentType: 'application/json',
            data:JSON.stringify({
                code:code.substring(1),
                description:description,
                qty:quantity,
                price:price
            })})
                .done(function (response) {
                    alert("Item Successfully Saved");

                    $('#ItemCode').val(getCurrentCode());
                    $('#itmDescription').val('');
                    $('#itmQuantity').val('');
                    $('#itmPrice').val('');
                    $('#itmDescription').focus();

                    //delete
                    $('tbody tr td:last-child img').off("click");
                    $('tbody tr td:last-child img').click(function () {
                        if (confirm("Do you really want to delete?")){
                            var addbtn1 = $("#addItem").clone(true);
                            var d = $(this).parents('tr').find('td:nth-child(1)').text();
                            console.log(d);
                            var t = $(this).parents('tr');

                            $.ajax({
                                method:"DELETE",
                                url:"http://localhost:8080/api/v1/items/"+d.substring(1),
                                async:true
                            }).done(function (data) {
                                alert("Customer Deleted Successfully");
                                t.remove();

                                $('#itmDescription').focus();

                                $("#ItemCode").val(getCurrentCode());
                                $('#itmDescription').val('');
                                $('#itmQuantity').val('');
                                $('#itmPrice').val('');

                                $("#updateItem").replaceWith(addbtn1);
                            }).fail(function (JXHR) {
                                alert(JXHR.valueOf().toString());

                                $('#itmDescription').focus();

                                $("#ItemCode").val(getCurrentCode());
                                $('#itmDescription').val('');
                                $('#itmQuantity').val('');
                                $('#itmPrice').val('');

                                $("#updateItem").replaceWith(addbtn1);
                            });
                        }
                    });


                    //update
                    $('tbody tr').off("click");
                    $('tbody tr').click(function () {
                        var th = $(this);
                        var valid =true;

                        var code = $(this).find('td:nth-child(1)').text();
                        var description = $(this).find('td:nth-child(2)').text();
                        var qty = $(this).find('td:nth-child(3)').text();
                        var price = $(this).find('td:nth-child(4)').text();

                        $('#itmItemCode').val(code);
                        $('#itmDescription').val(description);
                        $('#itmQuantity').val(qty);
                        $('#itmPrice').val(price);

                        $('#addItem').replaceWith('<button id="updateItem" type="button" class="btn btn-primary">Update Item</button>');
                        $('#updateItem').off('click');
                        $('#updateItem').click(function () {

                            if ($.trim($('#itmDescription').val()).length === 0) {
                                $('#itmDescription').css('box-shadow','1px 2px 5px  #b80009');
                                valid = false;
                            }
                            if ($.trim($('#itmPrice').val()).length === 0) {
                                $('#itmPrice').css('box-shadow','1px 2px 5px  #b80009');
                                valid = false;
                            }
                            if ($.trim($('#itmQuantity').val()).length === 0) {
                                $('#itmQuantity').css('box-shadow','1px 2px 5px  #b80009');
                                valid = false;
                            }

                            if (valid){
                                th.find('td:nth-child(2)').replaceWith('<td>'+$('#itmDescription').val()+'</td>');
                                th.find('td:nth-child(3)').replaceWith('<td>'+$('#itmQuantity').val()+'</td>');
                                th.find('td:nth-child(4)').replaceWith('<td>'+$('#itmPrice').val()+'</td>');

                                $.ajax({
                                    method:"PUT",
                                    url:"http://localhost:8080/item/"+code.substring(1),
                                    async:true,
                                    contentType: 'application/json',
                                    data:JSON.stringify({
                                        description:$('#itmDescription').val(),
                                        qty:$('#itmQuantity').val(),
                                        price:$('#itmPrice').val()
                                    })
                                }).done(function (data) {
                                    alert("Item Updated Successfully");
                                }).fail(function (error) {
                                    console.log(error);
                                });

                                $('#itmDescription').val('');
                                $('#itmQuantity').val('');
                                $('#itmPrice').val('');

                                $('#updateItem').replaceWith('<button id="addItem" type="button" class="btn btn-primary">Add Item</button>');
                                $('#ItemCode').val(getCurrentCode());
                                $('#itmDescription').focus()
                            }

                        });
                    });

                })
                .fail(function (errorThrown) {
                    console.log(errorThrown);
                });
    }
});

$("#btnnewItem").click(function () {
    var itmcode=$('tbody tr:last-child td:first-child').text().substring(1);
    var newcode='I00'+(1+parseInt(itmcode));
    $("#ItemCode").val(newcode);
    $("#itmItemName").val('');
    $("#itmDescription").val('');
    $("#itmQuantity").val('');
    $("#itmPrice").val('');
});