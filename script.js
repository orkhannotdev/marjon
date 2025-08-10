    const input = document.getElementById('uploadInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const viewer = document.getElementById('truckViewer');
    const thumbnails = document.querySelectorAll('.model-thumb');
    let currentIndex = 0;
    let writeMaterial = null;

    // Map each model file to its target material name
    const materialMap = {
      'Marjon.glb': 'write.003',
      'volvo.glb': 'write.001',
      'kiabongo.glb': 'write.002',
      'malibu.glb': 'write'
    };

    function getFilenameFromSrc(src) {
      try {
        const url = new URL(src, window.location.href);
        return url.pathname.split('/').pop();
      } catch {
        return (src || '').split('/').pop();
      }
    }

    viewer.addEventListener('load', async () => {
      const materials = viewer.model?.materials;
      if (!materials) {
        alert("No materials found on model.");
        return;
      }

      const fileName = getFilenameFromSrc(viewer.src);
      const targetMaterialName = materialMap[fileName] || 'write';

      writeMaterial = materials.find(mat => mat.name === targetMaterialName);
      if (!writeMaterial) {
        alert(`Material '${targetMaterialName}' not found on the model.`);
        return;
      }

      const defaultTextureURL = 'template.jpg';
      const texture = await viewer.createTexture(defaultTextureURL);
      writeMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
    });

    uploadBtn.addEventListener('click', () => input.click());

    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file || !writeMaterial) return;

      const imgURL = URL.createObjectURL(file);
      const texture = await viewer.createTexture(imgURL);
      writeMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
    });

    function updateViewer(index) {
      const selected = thumbnails[index];
      if (!selected) return;

      viewer.src = selected.dataset.model;
      viewer.poster = selected.dataset.poster;

      thumbnails.forEach(th => {
        th.classList.remove('selected');
        th.style.borderColor = 'transparent';
      });

      selected.classList.add('selected');
      selected.style.borderColor = '#3FF2C8';
      currentIndex = index;
    }

    thumbnails.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => updateViewer(idx));
    });

    document.getElementById('arrowLeft').addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateViewer(newIndex);
    });

    document.getElementById('arrowRight').addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % thumbnails.length;
      updateViewer(newIndex);
    });
