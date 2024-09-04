<script>
	import { goto } from '$app/navigation';
    import product from '$lib/images/product.png'

    function goToCheckout() {
        goto('/checkout');
    }
</script>


<section id="hero" class="hero section dark-background">

    <div class="container">
    <div class="row gy-4 justify-content-between">
        <div class="col-lg-4 order-lg-last hero-img" data-aos="zoom-out" data-aos-delay="100">
        <img src="{product}" class="img-fluid animated" alt="">
        </div>

        <div class="col-lg-6  d-flex flex-column justify-content-center" data-aos="fade-in">
        <h1>โปรโมชั่นราคาพิเศษมีจำนวนจำกัด</h1>
        <p>มีเสน่ห์ อ่อนวัย สไตล์ตัวแม่</p>
        <div class="d-flex">
            <a href="#pricing">
                <button type="button" class="btn-get-started btn btn-lg px-4 me-md-2" >สั่งซื้อ S-Complex</button>
            </a>
        </div>
        </div>

    </div>
    </div>

    <svg class="hero-waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28 " preserveAspectRatio="none">
    <defs>
        <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
    </defs>
    <g class="wave1">
        <use xlink:href="#wave-path" x="50" y="3"></use>
    </g>
    <g class="wave2">
        <use xlink:href="#wave-path" x="50" y="0"></use>
    </g>
    <g class="wave3">
        <use xlink:href="#wave-path" x="50" y="9"></use>
    </g>
    </svg>

</section>


<style>

</style>