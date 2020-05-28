
$('.btn-logout').click(function (e) {
    $.ajax({
        url: 'logout',
        method: 'post',
        success: function (data) {
            if (data.code == 0) {
                location.href = '/';
            }
        }
    });
});