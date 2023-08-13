//preloader
$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(3000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});
