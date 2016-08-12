$(function() {
	setTimeout(function() {
		lastOrder();
	}, 0);
});

$(window).on('resize', function() {
	lastOrder();

	$('a[href="#"]').on('click', function() { return false; })
})

function lastOrder() {
	$('.last-order').each(function() {
		const posY = $(this).offset().top;
		const winY = $(window).height();
		const pd = winY * 0.02;
		$(this).height(winY - posY - pd);
	});
}