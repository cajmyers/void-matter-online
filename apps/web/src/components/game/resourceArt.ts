import tcArt from "../../assets/icons/resources/tc.png";
import h3Art from "../../assets/icons/resources/h3.png";
import pcArt from "../../assets/icons/resources/pc.png";
import qpArt from "../../assets/icons/resources/qp.png";
import vmArt from "../../assets/icons/resources/vm.png";
import type { ResourceOrVm } from "./resources";

// The owner's resource token art (250 by 250, transparent background). Each resource
// has its own shape as well as its own colour, so it never relies on colour alone.
// TC silver square, H3 green circle, PC red triangle, QP blue diamond, VM purple star.
export const resourceArt: Readonly<Record<ResourceOrVm, string>> = {
  tc: tcArt,
  h3: h3Art,
  pc: pcArt,
  qp: qpArt,
  vm: vmArt,
};
