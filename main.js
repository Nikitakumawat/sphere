import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//Scene
const scene = new THREE.Scene();

//Create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#FFA500",
  roughness: 0.2,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

//Resize
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerHeight;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  mesh.rotation.x += 0.2;
  mesh.rotation.y += 0.2;
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//timeline
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
t1.fromTo("nav", { y: "-100%" }, { y: "0%" });
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//mouse animation
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    //let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

let radiusSelected = document.querySelector("#radius");
let btn = document.querySelector(".btn");
let colorbtn = document.querySelector(".color_btn");
let toast = document.getElementById("snackbar");

btn.addEventListener("click", () => {
  mesh.scale.set(
    Number(radiusSelected.value),
    Number(radiusSelected.value),
    Number(radiusSelected.value)
  );

  toast.className = "show";

  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
});

//function to change color of sphere
mesh.setColor = function (color) {
  mesh.material.color.set(color);
};

colorbtn.addEventListener("click", () => {
  mesh.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
  // if (
  //   mesh.material.color.r === 0 &&
  //   mesh.material.color.g === 0 &&
  //   mesh.material.color.b === 1
  // ) {
  //   mesh.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  // } else {
  //   mesh.setColor("blue");
  // }

  scene.add(mesh);
});
