$(document).ready(function() {
  var baseUrl = 'https://devpoint-ajax-example-server.herokuapp.com/api/v1';

  function productCard(product) {
    $.ajax({
      url: '/product_card',
      type: 'GET',
      data: {product: product},
      success: function(data) {
        $('#products').append(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  function getProducts() {
    $('#products').empty();
    $.ajax({
      url: baseUrl + '/products',
      type: 'GET',
      success: function(data) {
        var products = data.products;
          for(var i = 0; i < products.length; i++) {
            var product = products[i];
            if (product.quanity_on_hand > 0) {
              productCard(product);
            }
          }
      },
      error: function(data) {
        console.log(data);
      }
    });
  }

  getProducts();


  $(document).on('click', '#add_product', function(e) {
    $('#new_product').removeClass('hide');
    $('#add_product').addClass('hide');
  });

  $('#new_product').on('submit', function(e) {
    var newProduct = $('#new_product')
    e.preventDefault();
    $.ajax({
      url: baseUrl + '/products',
      type: 'POST',
      data: $(this).serializeArray(),
      success: function(data) {
        newProduct.children('input').val('');
        newProduct.addClass('hide');
        $('#add_product').removeClass('hide');
        getProducts();
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('click', '#show_product', function(e) {
    e.preventDefault();

    $.ajax({
      type: 'GET',
      url: baseUrl + '/products/' + $(this).attr('href'),
      success: function(data) {
        var product = data.product
        $('#products').empty();
        $('#add_product').addClass('hide');
        $('.hidden').removeClass('hide');
        productCard(product);

      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('click', '#edit_product', function(e) {
    e.preventDefault();
    var editForm = $('#new_product')
    editForm.removeClass('hide');
    $('#new_button').addClass('hide');
    $('#edit_button').removeClass('hide');
    $('#add_product').addClass('hide');
    $.ajax({
      type: 'GET',
      url: baseUrl + '/products/' + $(this).attr('href'),
      success: function(data) {
        var product = data.product;
        editForm.find('#product_name').val(product.name);
        editForm.find('#product_price').val(product.base_price);
        editForm.find('#product_description').val(product.description);
        editForm.find('#product_quantity').val(product.quanity_on_hand);
        editForm.find('#product_color').val(product.color);
        editForm.find('#product_weight').val(product.weight);
        editForm.find('#product_attr').val(product.other_attributes);
        editForm.find('#product_id').val(product.id);
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $('#edit_button').on('submit', function(e) {
    e.preventDefault();
    $('#new_product').addClass('hide');
    $('#add_product').removeClass('hide');
    var productId = $(this).find('#product_id').val();
    $.ajax({
      url: baseUrl + '/products/' + productId,
      type: 'PUT',
      data: $(this).serializeArray(),
      success: function(data) {
        getProducts();
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('click', '#delete_product', function(e) {
    e.preventDefault();

    $.ajax({
      url: baseUrl + '/products/' + $(this).attr('href'),
      type: 'DELETE',
      success: function(data) {
        getProducts();
        alert(data.message);
      },
      error: function(data) {
        console.log(data);
      }
    });
  });



});