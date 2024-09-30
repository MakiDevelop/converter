function showModal(message, title = "提示", closeOtherModals = true) {
    if (closeOtherModals) {
        $('.modal').modal('hide');
    }

    setTimeout(() => {
        $('#modalMessage').text(message);
        $('#infoModalLabel').text(title);
        $('#infoModal').modal('show');
    }, closeOtherModals ? 300 : 0);
}