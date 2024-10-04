<script>
  import chat1 from '$lib/images/chat1.png';
  import chat2 from '$lib/images/chat2.png';
  import chat3 from '$lib/images/chat3.png';
  import chat4 from '$lib/images/chat4.png';
</script>

<section>
  <div class="container py-5">
    <h1 class="fw-bold text-center mb-4">เสียงตอบรับจากลูกค้าผู้ใช้จริง</h1>
    <div class="row">
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 my-md-3 my-3">
        <img src="{chat1}" class="img-fluid animated">
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 my-md-3 my-3">
        <img src="{chat2}" class="img-fluid animated">
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 my-md-3 my-3">
        <img src="{chat3}" class="img-fluid animated">
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6 col-12 my-md-3 my-3">
        <img src="{chat4}" class="img-fluid animated">
      </div>
    </div>
    <div id="carousel1" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="{chat1}" class="d-block w-75 mx-auto">
        </div>
        <div class="carousel-item">
          <img src="{chat2}" class="d-block w-75 mx-auto">
        </div>
        <div class="carousel-item">
          <img src="{chat3}" class="d-block w-75 mx-auto">
        </div>
        <div class="carousel-item">
          <img src="{chat4}" class="d-block w-75 mx-auto">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</section>

<style>
  @media screen and (min-width: 576px) {
    #carousel1 {
      display: none;
    }
    .row {
      display: flex;
    }
  }

  @media screen and (max-width: 575px) {
    #carousel1 {
      display: block;
    }
    .row {
      display: none;
    }
  }

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
</style>
