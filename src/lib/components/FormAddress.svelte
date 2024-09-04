<script>
    export let form;
    export let errors;
</script>

<div class="step step-info">
    <h3>Address</h3>
    <div class="mb-3">
        <label for="city" class="form-label">City</label>
        <input
        type="text"
        class="form-control {$errors.city ? 'is-invalid' : ''}"
        id="city"
        name="city"
        bind:value={$form.city}
        />
        {#if $errors.city}<div class="invalid-feedback">{$errors.city}</div>{/if}
    </div>
    <div class="mb-3">
        <label for="district" class="form-label">District</label>
        <input
        type="text"
        class="form-control {$errors.district ? 'is-invalid' : ''}"
        id="district"
        name="district"
        bind:value={$form.district}
        />
        {#if $errors.district}<div class="invalid-feedback">{$errors.district}</div>{/if}
    </div>
    <div class="mb-3">
        <label for="province" class="form-label">Province</label>
        <input 
        type="text"
        class="form-control {$errors.province ? 'is-invalid' : ''}"
        id="province"
        name="province"
        bind:value={$form.province}
        />
        {#if $errors.province}<div class="invalid-feedback">{$errors.province}</div>{/if}
    </div>
    <div class="mb-3">
        <label for="province" class="form-label">Address</label>
        <input 
        type="text"
        class="form-control {$errors.address ? 'is-invalid' : ''}"
        id="address"
        name="address"
        bind:value={$form.address}
        />
        {#if $errors.province}<div class="invalid-feedback">{$errors.province}</div>{/if}
    </div>
    <div class="mb-3">
        <label for="postcode" class="form-label">Postcode</label>
        <input 
        type="text"
        class="form-control {$errors.postcode ? 'is-invalid' : ''}"
        id="postcode"
        name="postcode"
        bind:value={$form.postcode}
        />
        {#if $errors.postcode}<div class="invalid-feedback">{$errors.postcode}</div>{/if}
    </div>
    <div class="d-flex justify-content-between mt-4">
        <button class="btn cta-btn">
            Next
        </button>
    </div>
</div>
