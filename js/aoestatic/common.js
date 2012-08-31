/**
 * Send ajax request to the Magento store in order to insert dynamic content into the
 * static page delivered from Varnish
 *
 * @author Fabrizio Branca
 */
$.noConflict();
jQuery(document).ready(function($) {

	var data = { 
		getBlocks: {},
		url: document.URL
	};

	// add placeholders
	var counter = 0;
	$('.placeholder').each(function() {
		var id = $(this).attr('id');
		if (!id) {
			// create dynamic id
			id = 'ph_' + counter;
			$(this).attr('id', id);
		}
		var rel = $(this).attr('rel');
		if (rel) {
			data.getBlocks[id] = rel;
			counter++;
		} else {
			throw 'Found placeholder without rel attribute';
		}
	});

	// add current product
	if (typeof CURRENTPRODUCTID !== 'undefined' && CURRENTPRODUCTID) {
		data.currentProductId = CURRENTPRODUCTID;
	}

	// E.T. phone home
	if (typeof data.currentProductId !== 'undefined' || counter > 0) {
		$.get(
			AJAXHOME_URL,
			data,
			function (response) {
				// Replace placeholder
				for(var id in response.blocks) {
					$('#' + id).html(response.blocks[id]);
				}
				
				// Run addistion javascript
				for(var id in response.code) {
					eval(response.code[id]);
				}
			},
			'json'
		);
	}
	
});