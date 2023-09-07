class Player{
    constructor(role, x, y, z) {
        this.role = role; 
        this.position = new THREE.Vector3(x, y, z);
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.texture = new THREE.TextureLoader().load(`${role}.png`);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.position); 
      }
      
      updatePosition(x, y, z) {
        this.position.set(x, y, z);
        this.mesh.position.copy(this.position);
      }

}