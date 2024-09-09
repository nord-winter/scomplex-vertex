<script>
    // @ts-ignore
    import left_edge from '$lib/images/left_edge.png';
    // @ts-ignore
    import right_edge from '$lib/images/right_edge.png';
</script>
<div id="thankspage" class="container-fluid">
    <img class="edge-r" src="{right_edge }" alt="">
    <img class="edge-l" src="{left_edge }" alt="">
    <div class="container pt-5">
        <div class="row justify-content-center p-5">
            <div class="d-flex flex-column justify-content-center align-items-center p-3">
                <i class=" bi bi-check2-circle fs-1 d-flex bg-success rounded-circle p-1 text-white"></i>   
                <p class="h1">ขอบคุณสำหรับคำสั่งซื้อ!</p>
                <p class="h2">ทางเราได้รับออเดอร์ของคุณเรียบร้อยแล้ว</p>
            </div>
            <div class="row">
                <div class="col p-3">
                    <div class="card my-border" style="width: 18rem;">
                        <div class="card-body">
                            <div class="d-flex justify-content-center p-3">
                                <i class="bi bi-telephone fs-2 d-flex rounded-circle p-1 bg-thanks"></i>
                            </div>
                            <h5 class="card-title">โปรดรอรับโทรศัพท์</h5>
                            <p class="card-text">เจ้าหน้าที่ของเราจะติดต่อกลับหาคุณโดยด่วนที่สุดเพื่อยืนยันคำสั่งซื้อและที่อยู่ในการจัดส่งสินค้า</p>
                        </div>
                    </div>
                </div>
                <div class="col  p-3">
                    <div class="card my-border" style="width: 18rem;">
                        <div class="card-body">
                            <div class="d-flex justify-content-center p-3">
                                <i class="bi bi-hand-thumbs-up fs-2 d-flex rounded-circle p-1 bg-thanks"></i>
                            </div>
                            <h5 class="card-title">รับประกันความปลอดภัย 100%</h5>
                            <p class="card-text">สินค้าของแท้จากผู้ผลิตที่ผ่านการรับรองมาตรฐานและคุณภาพ</p>
                        </div>
                    </div>
                </div>
                <div class="col  p-3">
                    <div class="card my-border" style="width: 18rem;">
                        <div class="card-body">
                            <div class="d-flex justify-content-center p-3">
                                <i class="bi bi-truck fs-2 d-flex rounded-circle p-1 bg-thanks "></i>
                            </div>
                            <h5 class="card-title">จัดส่งปลอดภัย</h5>
                            <p class="card-text">ภายใต้กระบวนการจัดส่งสินค้าและชำระเงิน โดยปราศจากการสัมผัสโดยตรง</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<style>
.edge-r {
    position: absolute;
    top: 0;
    right: 0;
}
.edge-l {
    position: absolute;
    left: 0;
    bottom: 0;
}
.bg-thanks {
    color: white;
    background-color: #eb4b64;
}
.my-border {
    background-color: white;
    border: 5px solid #eb4b64;
    border-radius: 20px;
    padding: 15px;
    margin: 0 10px;
    max-width: 240px;

}
</style>