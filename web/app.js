const state = {
  caseInformation: "",
  dateOfSearch: "",
  conclusionDate: "",
  premiseAddress: "",
  partyName: "",
  partyFatherName: "",
  partyAadhaar: "",
  partyAddress: "",
  authorizedOfficer: "",
  examinerName: "",
  employedBy: "EnReach Solution",
  deviceCount: 1,
  deviceLabel: "",
  deviceType: "",
  deviceName: "",
  deviceMake: "",
  deviceSize: "",
  deviceModelNo: "",
  deviceSerialNo: "",
  deviceImei1: "",
  deviceImei2: "",
  useDeviceType: false,
  useDeviceName: false,
  useMake: true,
  useModel: true,
  useSerial: true,
  useSize: true,
  useImei1: false,
  useImei2: false,
  hashType: "md5sha1",
  hashMd5: "",
  hashSha1: "",
  hashSha256: "",
  imagingSoftware: "",
  actionTaken: "",
  masterCopyMake: "",
  masterCopyModel: "",
  masterCopySerial: "",
  masterCopySize: "",
  workingCopyMake: "",
  workingCopyModel: "",
  workingCopySerial: "",
  workingCopySize: "",
  masterCopies: [],
  workingCopies: [],
  stickerWorkingSerial: "",
  stickerMasterSerial: "",
  deviceCopyAssociations: {}, // Maps device index to { masterCopies: [], workingCopies: [] }
  copyDigitalEvidence: {}, // Maps copy ID (M-0, W-1, etc.) to digital evidence details
  includeReviewAnalysis: true,
  includeTeamCode: false,
  teamCode: "",
  workstationsUsed: "",
  jobPurpose: "Evidence",
  customEnabled: false,
  customTitle: "",
  customTemplate: "",
  customDocxName: "",
  deviceList: [],
  editingDeviceIndex: -1
};

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const renderDeviceList = () => {
  const el = document.getElementById("deviceList");
  if (!state.deviceList.length) {
    el.innerHTML = '<div style="color: var(--muted); text-align: center; padding: 20px;">No devices added yet. Fill the form above and click "Add Device to Case"</div>';
    return;
  }
  el.innerHTML = "";
  state.deviceList.forEach((device, idx) => {
    const chip = document.createElement("div");
    chip.className = "device-chip";
    const parts = [];
    if (device.type) parts.push(device.type);
    if (device.name) parts.push(device.name);
    if (device.make) parts.push(device.make);
    if (device.model) parts.push(device.model);
    const deviceInfo = parts.join(' - ') || 'Device';
    const serialInfo = device.serial ? ` (S/N: ${device.serial})` : '';
    const label = device.label ? `[${device.label}] ` : '';
    chip.innerHTML = `<strong>#${idx + 1}</strong> ${escapeHtml(label)}${escapeHtml(deviceInfo)}${escapeHtml(serialInfo)} <button class="edit-btn" data-idx="${idx}" title="Edit device">✏️</button> <button class="delete-btn" data-idx="${idx}" title="Remove device">✕</button>`;
    el.appendChild(chip);
  });
  el.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      loadDeviceForEdit(idx);
    });
  });
  el.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      state.deviceList.splice(idx, 1);
      renderDeviceList();
      renderCopyLists(); // Update device selectors in copy lists
      renderPreview();
    });
  });
};

const loadDeviceForEdit = (idx) => {
  const device = state.deviceList[idx];
  state.editingDeviceIndex = idx;
  state.deviceLabel = device.label || "";
  state.deviceType = device.type || "";
  state.deviceName = device.name || "";
  state.deviceMake = device.make || "";
  state.deviceSize = device.size || "";
  state.deviceModelNo = device.model || "";
  state.deviceSerialNo = device.serial || "";
  state.deviceImei1 = device.imei1 || "";
  state.deviceImei2 = device.imei2 || "";
  state.useDeviceType = device.useType || false;
  state.useDeviceName = device.useName || false;
  state.useMake = device.useMake !== undefined ? device.useMake : true;
  state.useModel = device.useModel !== undefined ? device.useModel : true;
  state.useSerial = device.useSerial !== undefined ? device.useSerial : true;
  state.useSize = device.useSize !== undefined ? device.useSize : true;
  state.useImei1 = device.useImei1 || false;
  state.useImei2 = device.useImei2 || false;
  state.hashType = device.hashType || "md5sha1";
  state.hashMd5 = device.md5 || "";
  state.hashSha1 = device.sha1 || "";
  state.hashSha256 = device.sha256 || "";
  state.imagingSoftware = device.imagingSoftware || "";
  state.actionTaken = device.action || "";
  
  // Update form fields
  document.getElementById("deviceLabel").value = state.deviceLabel;
  document.getElementById("deviceType").value = state.deviceType;
  document.getElementById("deviceName").value = state.deviceName;
  document.getElementById("deviceMake").value = state.deviceMake;
  document.getElementById("deviceSize").value = state.deviceSize;
  document.getElementById("deviceModelNo").value = state.deviceModelNo;
  document.getElementById("deviceSerialNo").value = state.deviceSerialNo;
  document.getElementById("deviceImei1").value = state.deviceImei1;
  document.getElementById("deviceImei2").value = state.deviceImei2;
  document.getElementById("useDeviceType").checked = state.useDeviceType;
  document.getElementById("useDeviceName").checked = state.useDeviceName;
  document.getElementById("useMake").checked = state.useMake;
  document.getElementById("useModel").checked = state.useModel;
  document.getElementById("useSerial").checked = state.useSerial;
  document.getElementById("useSize").checked = state.useSize;
  document.getElementById("useImei1").checked = state.useImei1;
  document.getElementById("useImei2").checked = state.useImei2;
  document.querySelector(`input[name="hashType"][value="${state.hashType}"]`).checked = true;
  document.getElementById("hashMd5").value = state.hashMd5;
  document.getElementById("hashSha1").value = state.hashSha1;
  document.getElementById("hashSha256").value = state.hashSha256;
  document.getElementById("imagingSoftware").value = state.imagingSoftware;
  document.getElementById("actionTaken").value = state.actionTaken;
  
  toggleFieldVisibility();
  toggleHashFields();
  document.getElementById("btn-add-device").textContent = "💾 Update Device";
  document.getElementById("btn-add-device").scrollIntoView({ behavior: "smooth", block: "center" });
};

const renderCopyLists = () => {
  const masterEl = document.getElementById("masterCopyList");
  const workingEl = document.getElementById("workingCopyList");
  if (masterEl) {
    if (!state.masterCopies.length) {
      masterEl.innerHTML = '<div style="color: var(--muted); font-size: 12px; font-style: italic;">No master copies added</div>';
    } else {
      masterEl.innerHTML = state.masterCopies.map((item, idx) => {
        // Get assigned devices
        const assignedDevices = (item.devices || []).map(devIdx => {
          const device = state.deviceList[devIdx];
          if (!device) return null;
          const label = device.label || `Device #${devIdx + 1}`;
          return { devIdx, label };
        }).filter(Boolean);
        
        // Available devices (not yet assigned to this copy)
        const availableDevices = state.deviceList
          .map((device, devIdx) => ({ device, devIdx }))
          .filter(({ devIdx }) => !item.devices || !item.devices.includes(devIdx));
        
        return `
        <div class="copy-item-card" style="border: 2px solid #ddd; padding: 12px; margin-bottom: 12px; border-radius: 8px; background: #f9f9f9;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div style="flex: 1;">
              <strong style="color: #2563eb;">${item.id}:</strong> ${escapeHtml(item.make)} ${escapeHtml(item.model)} | ${escapeHtml(item.size)} | S/N: ${escapeHtml(item.serial)}
            </div>
            <button class="delete-copy-btn" data-type="master" data-idx="${idx}" title="Remove" style="background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">✕</button>
          </div>
          <div style="margin-top: 8px;">
            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Devices in this copy:</label>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; min-height: 32px; padding: 6px; border: 1px solid #e5e7eb; border-radius: 4px; background: white;">
              ${assignedDevices.length > 0 ? assignedDevices.map(({ devIdx, label }) => `
                <div class="device-chip-small" style="display: inline-flex; align-items: center; gap: 4px; background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                  <span>${escapeHtml(label)}</span>
                  <button class="remove-device-btn" data-type="master" data-copy-idx="${idx}" data-dev-idx="${devIdx}" style="background: none; border: none; color: #1e40af; cursor: pointer; padding: 0; font-size: 14px; line-height: 1;" title="Remove device">×</button>
                </div>
              `).join('') : '<span style="color: #9ca3af; font-size: 11px;">No devices assigned</span>'}
            </div>
            ${availableDevices.length > 0 ? `
              <select class="add-device-selector" data-type="master" data-idx="${idx}" style="width: 100%; font-size: 12px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="">+ Add device to this copy...</option>
                ${availableDevices.map(({ device, devIdx }) => {
                  const deviceLabel = device.label || `Device #${devIdx + 1}`;
                  return `<option value="${devIdx}">${escapeHtml(deviceLabel)}</option>`;
                }).join("")}
              </select>
            ` : '<div style="color: #9ca3af; font-size: 11px; font-style: italic;">All devices assigned</div>'}
          </div>
          <div style="margin-top: 8px;">
            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Digital Evidence Details:</label>
            <textarea class="copy-evidence-input" data-copy-id="${item.id}" data-type="master" data-idx="${idx}" placeholder="Enter digital evidence details for this master copy..." style="width: 100%; height: 60px; font-size: 12px; padding: 6px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;">${escapeHtml(item.digitalEvidence || "")}</textarea>
          </div>
        </div>
      `}).join("");
    }
  }
  if (workingEl) {
    if (!state.workingCopies.length) {
      workingEl.innerHTML = '<div style="color: var(--muted); font-size: 12px; font-style: italic;">No working copies added</div>';
    } else {
      workingEl.innerHTML = state.workingCopies.map((item, idx) => {
        // Get assigned devices
        const assignedDevices = (item.devices || []).map(devIdx => {
          const device = state.deviceList[devIdx];
          if (!device) return null;
          const label = device.label || `Device #${devIdx + 1}`;
          return { devIdx, label };
        }).filter(Boolean);
        
        // Available devices (not yet assigned to this copy)
        const availableDevices = state.deviceList
          .map((device, devIdx) => ({ device, devIdx }))
          .filter(({ devIdx }) => !item.devices || !item.devices.includes(devIdx));
        
        return `
        <div class="copy-item-card" style="border: 2px solid #ddd; padding: 12px; margin-bottom: 12px; border-radius: 8px; background: #f9f9f9;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div style="flex: 1;">
              <strong style="color: #16a34a;">${item.id}:</strong> ${escapeHtml(item.make)} ${escapeHtml(item.model)} | ${escapeHtml(item.size)} | S/N: ${escapeHtml(item.serial)}
            </div>
            <button class="delete-copy-btn" data-type="working" data-idx="${idx}" title="Remove" style="background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">✕</button>
          </div>
          <div style="margin-top: 8px;">
            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Devices in this copy:</label>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; min-height: 32px; padding: 6px; border: 1px solid #e5e7eb; border-radius: 4px; background: white;">
              ${assignedDevices.length > 0 ? assignedDevices.map(({ devIdx, label }) => `
                <div class="device-chip-small" style="display: inline-flex; align-items: center; gap: 4px; background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                  <span>${escapeHtml(label)}</span>
                  <button class="remove-device-btn" data-type="working" data-copy-idx="${idx}" data-dev-idx="${devIdx}" style="background: none; border: none; color: #166534; cursor: pointer; padding: 0; font-size: 14px; line-height: 1;" title="Remove device">×</button>
                </div>
              `).join('') : '<span style="color: #9ca3af; font-size: 11px;">No devices assigned</span>'}
            </div>
            ${availableDevices.length > 0 ? `
              <select class="add-device-selector" data-type="working" data-idx="${idx}" style="width: 100%; font-size: 12px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="">+ Add device to this copy...</option>
                ${availableDevices.map(({ device, devIdx }) => {
                  const deviceLabel = device.label || `Device #${devIdx + 1}`;
                  return `<option value="${devIdx}">${escapeHtml(deviceLabel)}</option>`;
                }).join("")}
              </select>
            ` : '<div style="color: #9ca3af; font-size: 11px; font-style: italic;">All devices assigned</div>'}
          </div>
          <div style="margin-top: 8px;">
            <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 4px;">Digital Evidence Details:</label>
            <textarea class="copy-evidence-input" data-copy-id="${item.id}" data-type="working" data-idx="${idx}" placeholder="Enter digital evidence details for this working copy..." style="width: 100%; height: 60px; font-size: 12px; padding: 6px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;">${escapeHtml(item.digitalEvidence || "")}</textarea>
          </div>
        </div>
      `}).join("");
    }
  }
  
  // Bind event listeners for delete copy buttons
  document.querySelectorAll(".delete-copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.idx);
      const type = btn.dataset.type;
      if (type === "master") state.masterCopies.splice(idx, 1);
      if (type === "working") state.workingCopies.splice(idx, 1);
      renderCopyLists();
      renderPreview();
    });
  });
  
  // Bind event listeners for removing devices
  document.querySelectorAll(".remove-device-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const copyIdx = Number(btn.dataset.copyIdx);
      const devIdx = Number(btn.dataset.devIdx);
      const type = btn.dataset.type;
      
      if (type === "master") {
        state.masterCopies[copyIdx].devices = state.masterCopies[copyIdx].devices.filter(idx => idx !== devIdx);
      } else {
        state.workingCopies[copyIdx].devices = state.workingCopies[copyIdx].devices.filter(idx => idx !== devIdx);
      }
      renderCopyLists();
      renderPreview();
    });
  });
  
  // Bind event listeners for adding devices
  document.querySelectorAll(".add-device-selector").forEach((select) => {
    select.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.idx);
      const type = e.target.dataset.type;
      const devIdx = Number(e.target.value);
      
      if (e.target.value && !isNaN(devIdx)) {
        if (type === "master") {
          if (!state.masterCopies[idx].devices) state.masterCopies[idx].devices = [];
          state.masterCopies[idx].devices.push(devIdx);
        } else {
          if (!state.workingCopies[idx].devices) state.workingCopies[idx].devices = [];
          state.workingCopies[idx].devices.push(devIdx);
        }
        renderCopyLists();
        renderPreview();
      }
    });
  });
  
  // Bind event listeners for evidence input
  document.querySelectorAll(".copy-evidence-input").forEach((textarea) => {
    textarea.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.idx);
      const type = e.target.dataset.type;
      if (type === "master") {
        state.masterCopies[idx].digitalEvidence = e.target.value;
      } else {
        state.workingCopies[idx].digitalEvidence = e.target.value;
      }
      renderPreview();
    });
  });
};

const getCopyList = (type) => {
  const list = type === "master" ? state.masterCopies : state.workingCopies;
  if (list.length) return list;
  if (type === "master" && (state.masterCopyMake || state.masterCopySerial || state.masterCopySize || state.masterCopyModel)) {
    return [{
      make: state.masterCopyMake,
      model: state.masterCopyModel,
      serial: state.masterCopySerial,
      size: state.masterCopySize
    }];
  }
  if (type === "working" && (state.workingCopyMake || state.workingCopySerial || state.workingCopySize || state.workingCopyModel)) {
    return [{
      make: state.workingCopyMake,
      model: state.workingCopyModel,
      serial: state.workingCopySerial,
      size: state.workingCopySize
    }];
  }
  return [];
};

const renderCopyTable = (title, list) => {
  if (!list.length) return `<div class="section"><strong>${title}:</strong> Not provided.</div>`;
  const rows = list.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${escapeHtml(item.make)}</td>
      <td>${escapeHtml(item.model)}</td>
      <td>${escapeHtml(item.serial)}</td>
      <td>${escapeHtml(item.size)}</td>
    </tr>
  `).join("");
  return `
    <div class="section">
      <strong>${title}</strong>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Make</th>
            <th>Model</th>
            <th>Serial</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
};

const getCommon = () => ({
  caseInformation: escapeHtml(state.caseInformation),
  dateOfSearch: escapeHtml(formatDate(state.dateOfSearch)),
  conclusionDate: escapeHtml(formatDate(state.conclusionDate)),
  premiseAddress: escapeHtml(state.premiseAddress),
  partyName: escapeHtml(state.partyName),
  partyFatherName: escapeHtml(state.partyFatherName),
  partyAadhaar: escapeHtml(state.partyAadhaar),
  partyAddress: escapeHtml(state.partyAddress),
  authorizedOfficer: escapeHtml(state.authorizedOfficer),
  examinerName: escapeHtml(state.examinerName),
  employedBy: escapeHtml(state.employedBy),
  deviceType: escapeHtml(state.deviceType),
  deviceName: escapeHtml(state.deviceName),
  deviceMake: escapeHtml(state.deviceMake),
  deviceSize: escapeHtml(state.deviceSize),
  deviceModelNo: escapeHtml(state.deviceModelNo),
  deviceSerialNo: escapeHtml(state.deviceSerialNo),
  deviceImei1: escapeHtml(state.deviceImei1),
  deviceImei2: escapeHtml(state.deviceImei2),
  hashMd5: escapeHtml(state.hashMd5),
  hashSha1: escapeHtml(state.hashSha1),
  hashSha256: escapeHtml(state.hashSha256),
  imagingSoftware: escapeHtml(state.imagingSoftware),
  actionTaken: escapeHtml(state.actionTaken),
  masterCopyMake: escapeHtml(state.masterCopyMake),
  masterCopyModel: escapeHtml(state.masterCopyModel),
  masterCopySerial: escapeHtml(state.masterCopySerial),
  masterCopySize: escapeHtml(state.masterCopySize),
  workingCopyMake: escapeHtml(state.workingCopyMake),
  workingCopyModel: escapeHtml(state.workingCopyModel),
  workingCopySerial: escapeHtml(state.workingCopySerial),
  workingCopySize: escapeHtml(state.workingCopySize),
  stickerWorkingSerial: escapeHtml(state.stickerWorkingSerial),
  stickerMasterSerial: escapeHtml(state.stickerMasterSerial)
});

const getDevices = () => {
  if (state.deviceList.length) return state.deviceList;
  if (!state.deviceLabel) return [];
  return [{
    label: state.deviceLabel,
    type: state.deviceType,
    name: state.deviceName,
    make: state.deviceMake,
    size: state.deviceSize,
    model: state.deviceModelNo,
    serial: state.deviceSerialNo,
    imei1: state.deviceImei1,
    imei2: state.deviceImei2,
    useType: state.useDeviceType,
    useName: state.useDeviceName,
    useMake: state.useMake,
    useModel: state.useModel,
    useSerial: state.useSerial,
    useSize: state.useSize,
    useImei1: state.useImei1,
    useImei2: state.useImei2,
    hashType: state.hashType,
    md5: state.hashMd5,
    sha1: state.hashSha1,
    sha256: state.hashSha256,
    imagingSoftware: state.imagingSoftware,
    action: state.actionTaken
  }];
};

const renderDeviceTable = (devices) => {
  if (!devices.length) return "<div>No device added.</div>";
  const rows = devices.map((d, idx) => {
    // Build rows dynamically based on which fields are used
    let fieldRows = [];
    
    // First row: Type and Name if used
    if (d.useType || d.useName) {
      if (d.useType && d.useName) {
        fieldRows.push(`
          <tr>
            <td>Type</td>
            <td colspan="3">${escapeHtml(d.type || '')}</td>
            <td>Name</td>
            <td colspan="2">${escapeHtml(d.name || '')}</td>
          </tr>
        `);
      } else if (d.useType) {
        fieldRows.push(`
          <tr>
            <td>Type</td>
            <td colspan="6">${escapeHtml(d.type || '')}</td>
          </tr>
        `);
      } else if (d.useName) {
        fieldRows.push(`
          <tr>
            <td>Name</td>
            <td colspan="6">${escapeHtml(d.name || '')}</td>
          </tr>
        `);
      }
    }

    // Make and Model
    if (d.useMake || d.useModel) {
      if (d.useMake && d.useModel) {
        fieldRows.push(`
          <tr>
            <td>Make</td>
            <td colspan="3">${escapeHtml(d.make || '')}</td>
            <td>Model</td>
            <td colspan="2">${escapeHtml(d.model || '')}</td>
          </tr>
        `);
      } else if (d.useMake) {
        fieldRows.push(`
          <tr>
            <td>Make</td>
            <td colspan="6">${escapeHtml(d.make || '')}</td>
          </tr>
        `);
      } else if (d.useModel) {
        fieldRows.push(`
          <tr>
            <td>Model</td>
            <td colspan="6">${escapeHtml(d.model || '')}</td>
          </tr>
        `);
      }
    }

    // Serial and Size
    if (d.useSerial || d.useSize) {
      if (d.useSerial && d.useSize) {
        fieldRows.push(`
          <tr>
            <td>Serial Number</td>
            <td colspan="3">${escapeHtml(d.serial || '')}</td>
            <td>Size</td>
            <td colspan="2">${escapeHtml(d.size || '')}</td>
          </tr>
        `);
      } else if (d.useSerial) {
        fieldRows.push(`
          <tr>
            <td>Serial Number</td>
            <td colspan="6">${escapeHtml(d.serial || '')}</td>
          </tr>
        `);
      } else if (d.useSize) {
        fieldRows.push(`
          <tr>
            <td>Size</td>
            <td colspan="6">${escapeHtml(d.size || '')}</td>
          </tr>
        `);
      }
    }

    // IMEI 1 and 2
    if (d.useImei1 || d.useImei2) {
      if (d.useImei1 && d.useImei2) {
        fieldRows.push(`
          <tr>
            <td>IMEI 1</td>
            <td colspan="3">${escapeHtml(d.imei1 || '')}</td>
            <td>IMEI 2</td>
            <td colspan="2">${escapeHtml(d.imei2 || '')}</td>
          </tr>
        `);
      } else if (d.useImei1) {
        fieldRows.push(`
          <tr>
            <td>IMEI 1</td>
            <td colspan="6">${escapeHtml(d.imei1 || '')}</td>
          </tr>
        `);
      } else if (d.useImei2) {
        fieldRows.push(`
          <tr>
            <td>IMEI 2</td>
            <td colspan="6">${escapeHtml(d.imei2 || '')}</td>
          </tr>
        `);
      }
    }

    // Add Action Taken row
    fieldRows.push(`
      <tr>
        <td colspan="7"><strong>Action Taken:</strong> ${escapeHtml(d.action || '')}</td>
      </tr>
    `);

    const rowSpan = fieldRows.length;

    let detailRows = `
      <tr>
        <td rowspan="${rowSpan}">${idx + 1}</td>
      </tr>
      ${fieldRows.join('')}
    `;

    return detailRows;
  }).join("");

  return `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th colspan="7">Device Details</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const renderSignatureTable = ({ includeAuthorizedOfficer = true } = {}) => `
  <table>
    <thead>
      <tr>
        <th>Party Signature</th>
        <th>Witness 1 Signature</th>
        <th>Witness 2 Signature</th>
        <th>Examiner Signature</th>
        ${includeAuthorizedOfficer ? "<th>Authorized Officer Signature</th>" : ""}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="height:40px"></td>
        <td style="height:40px"></td>
        <td style="height:40px"></td>
        <td style="height:40px"></td>
        ${includeAuthorizedOfficer ? "<td style=\"height:40px\"></td>" : ""}
      </tr>
    </tbody>
  </table>
`;

const renderJobDeviceTable = (devices) => {
  if (!devices.length) return "<div>No device added.</div>";
  const rows = devices.map((d, idx) => {
    const details = [];
    if (d.label) details.push(d.label);
    if (d.make) details.push(`Make: ${escapeHtml(d.make)}`);
    if (d.model) details.push(`Model: ${escapeHtml(d.model)}`);
    if (d.serial) details.push(`S/N: ${escapeHtml(d.serial)}`);
    if (d.size) details.push(`${escapeHtml(d.size)}`);
    if (d.imei1) details.push(`IMEI1: ${escapeHtml(d.imei1)}`);
    if (d.imei2) details.push(`IMEI2: ${escapeHtml(d.imei2)}`);
    
    const deviceType = d.type || d.name || 'Device';
    const detailsStr = details.join(', ');
    
    return `
      <tr>
        <td style="text-align:center;">${idx + 1}.</td>
        <td>${escapeHtml(deviceType)}</td>
        <td>${escapeHtml(d.action || 'IMAGING & EXTRACTION')}</td>
        <td>${detailsStr}</td>
      </tr>
    `;
  }).join("");
  
  return `
    <table>
      <thead>
        <tr>
          <th style="width:50px;">Sr. no.</th>
          <th style="width:120px;">Device Type</th>
          <th style="width:180px;">Action Taken</th>
          <th>Details (Model # Serial # Identity Marks, Conditions etc.)</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const renderHashBlock = (device) => {
  const hashType = device.hashType || "md5sha1";
  
  if (hashType === "md5sha1") {
    return `
      <div class="hash-block">
        <div class="hash-title">Hash Values (MD5 & SHA1)</div>
        <div class="hash-row"><span>MD5</span> ${escapeHtml(device.md5 || "")}</div>
        <div class="hash-row"><span>SHA1</span> ${escapeHtml(device.sha1 || "")}</div>
      </div>
    `;
  } else {
    return `
      <div class="hash-block">
        <div class="hash-title">Hash Values (SHA256)</div>
        <div class="hash-row"><span>SHA256</span> ${escapeHtml(device.sha256 || "")}</div>
      </div>
    `;
  }
};

const applyTemplate = (template, data) => {
  if (!template) return "";
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const normalized = key.trim();
    return data[normalized] ?? "";
  });
};

const renderCustomDoc = () => {
  if (!state.customEnabled) {
    return `<div class="section">Custom document is disabled.</div>`;
  }
  const d = getCommon();
  const devices = getDevices();
  const data = {
    caseInformation: d.caseInformation,
    dateOfSearch: d.dateOfSearch,
    conclusionDate: d.conclusionDate,
    premiseAddress: d.premiseAddress,
    partyName: d.partyName,
    partyFatherName: d.partyFatherName,
    partyAadhaar: d.partyAadhaar,
    partyAddress: d.partyAddress,
    authorizedOfficer: d.authorizedOfficer,
    examinerName: d.examinerName,
    employedBy: d.employedBy,
    deviceType: d.deviceType,
    deviceName: d.deviceName,
    deviceMake: d.deviceMake,
    deviceSize: d.deviceSize,
    deviceModelNo: d.deviceModelNo,
    deviceSerialNo: d.deviceSerialNo,
    deviceImei1: d.deviceImei1,
    deviceImei2: d.deviceImei2,
    hashMd5: d.hashMd5,
    hashSha1: d.hashSha1,
    hashSha256: d.hashSha256,
    imagingSoftware: d.imagingSoftware,
    actionTaken: d.actionTaken,
    devices_table: renderDeviceTable(devices),
    hash_blocks: devices.map((device) => renderHashBlock(device)).join("")
  };
  const title = state.customTitle || "Custom Document";
  const body = applyTemplate(state.customTemplate, data);
  return `
    <div class="doc-title">${escapeHtml(title)}</div>
    <div class="doc-subtitle">Custom Template</div>
    <div class="section">${body || "Paste a template to render."}</div>
    ${state.customDocxName ? `<div class="section muted">Uploaded DOCX: ${escapeHtml(state.customDocxName)}</div>` : ""}
  `;
};

const templates = {
  cert63: () => {
    const d = getCommon();
    const devices = getDevices();
    const masterList = getCopyList("master");
    const workingList = getCopyList("working");
    const partA = `
      <div class="doc-title">Certificate</div>
      <div class="doc-subtitle">Section 63(4)(c) - Part A</div>
      <div class="section">
        <div class="label">Part A (To be filled by the Party)</div>
        <p>
          I, <strong>${d.partyName}</strong> Son of Shri <strong>${d.partyFatherName}</strong>,
          Aadhaar No. <strong>${d.partyAadhaar}</strong>, residing at <strong>${d.partyAddress}</strong>,
          in the case of <strong>${d.caseInformation}</strong>, affirm and sincerely state that we have
          produced electronic record/output from the following device(s)/digital record source.
        </p>
      </div>
      <div class="section">
        <strong>Devices Produced:</strong>
        ${renderDeviceTable(devices)}
      </div>
      <div class="section meta-grid">
        <div><span class="label">Date:</span> ${d.dateOfSearch}</div>
        <div><span class="label">Party Name:</span> ${d.partyName}</div>
      </div>
      <div class="section">
        <div class="signature">Party Signature:</div>
      </div>
    `;

    const partB = `
      <!--PAGEBREAK-->
      <div class="doc-title">Certificate</div>
      <div class="doc-subtitle">Section 63(4)(c) - Part B</div>
      <div class="section">
        <div class="label">Part B (To be filled by the Expert)</div>
        <p>
          I, <strong>${d.examinerName}</strong>, employed by <strong>${d.employedBy}</strong> as a Digital Forensic Examiner,
          do hereby solemnly affirm
          that the produced electronic record/output was obtained from:
        </p>
      </div>
      ${devices.map((device, idx) => `
        <div class="device-entry">
          <div class="section">
            <strong>Device #${idx + 1}:</strong>
            ${renderDeviceTable([device])}
          </div>
          <div class="section">
            ${renderHashBlock(device)}
          </div>
        </div>
      `).join("")}
      ${renderCopyTable("Master Copy Details", masterList)}
      ${renderCopyTable("Working Copy Details", workingList)}
      <div class="section meta-grid">
        <div><span class="label">Date:</span> ${d.conclusionDate}</div>
        <div><span class="label">Digital Forensic Examiner:</span> ${d.examinerName}</div>
      </div>
      <div class="section">
        <div class="signature">Examiner Signature:</div>
      </div>
    `;

    return `${partA}${partB}`;
  },
  coc: () => {
    const d = getCommon();
    const masterList = getCopyList("master");
    const workingList = getCopyList("working");
    
    // Pair master and working copies by index (M-0 with W-0, M-1 with W-1, etc.)
    const maxPairs = Math.max(state.masterCopies.length, state.workingCopies.length);
    
    if (maxPairs === 0) {
      // Fallback to old format if no copies are added
      return `
        <div class="doc-title">Chain of Custody</div>
        <div class="doc-subtitle">Digital Evidence Handling</div>
        <div class="section" style="padding: 20px; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; text-align: center;">
          <strong>⚠️ No master or working copies added yet</strong><br/>
          <span style="font-size: 12px; color: #92400e;">Please add master and working copies in the form to generate proper Chain of Custody documents.</span>
        </div>
        <div class="section">
          <div class="meta-grid">
            <div><span class="label">Case Information:</span> ${d.caseInformation}</div>
            <div><span class="label">Date of Search:</span> ${d.dateOfSearch}</div>
            <div><span class="label">Premise Address:</span> ${d.premiseAddress}</div>
            <div><span class="label">Description:</span> Digital data collected from various devices and stored in following storage device.</div>
          </div>
        </div>
        ${renderCopyTable("Master Copy Details", masterList)}
        ${renderCopyTable("Working Copy Details", workingList)}
        <table>
          <thead>
            <tr>
              <th>Reason/Action</th>
              <th>Received From</th>
              <th>Received By</th>
              <th>Date</th>
              <th>Time</th>
              <th>Sign of Receiver</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HANDOVER</td>
              <td>${d.authorizedOfficer}</td>
              <td>${d.examinerName}<br/><small>Digital Forensic Examiner</small></td>
              <td>${d.dateOfSearch}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>HANDOVER</td>
              <td>${d.examinerName}<br/><small>Digital Forensic Examiner</small></td>
              <td>${d.authorizedOfficer}</td>
              <td>${d.conclusionDate}</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="section">
          ${renderSignatureTable()}
        </div>
      `;
    }
    
    // Generate COC for each master-working pair
    const cocDocuments = Array.from({ length: maxPairs }, (_, pairIdx) => {
      const masterCopy = state.masterCopies[pairIdx];
      const workingCopy = state.workingCopies[pairIdx];
      const devices = getDevices();
      
      // Get all unique devices from both master and working in this pair
      const masterDeviceIds = masterCopy?.devices || [];
      const workingDeviceIds = workingCopy?.devices || [];
      const allDeviceIds = [...new Set([...masterDeviceIds, ...workingDeviceIds])];
      const pairDevices = allDeviceIds.map(devIdx => devices[devIdx]).filter(Boolean);
      
      const deviceRows = pairDevices.length 
        ? pairDevices.map((device, idx) => {
            const deviceLabel = device.label || `Device #${idx + 1}`;
            return `<tr><td>${idx + 1}</td><td>${escapeHtml(deviceLabel)}</td></tr>`;
          }).join("")
        : `<tr><td colspan="2" style="text-align: center; color: #666;">No devices assigned</td></tr>`;
      
      return `
        ${pairIdx > 0 ? '<!--PAGEBREAK-->' : ''}
        <div class="doc-title">Chain of Custody - Set ${pairIdx + 1}</div>
        <div class="doc-subtitle">Digital Evidence Handling</div>
        <div class="section">
          <div class="meta-grid">
            <div><span class="label">Case Information:</span> ${d.caseInformation}</div>
            <div><span class="label">Date of Search:</span> ${d.dateOfSearch}</div>
            <div><span class="label">Premise Address:</span> ${d.premiseAddress}</div>
            <div><span class="label">Storage Set:</span> Master and Working Copy Pair ${pairIdx + 1}</div>
          </div>
        </div>
        ${masterCopy ? `
          <div class="section">
            <strong>Master Copy ${masterCopy.id} Storage Details</strong>
            <table>
              <thead>
                <tr>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Serial Number</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${escapeHtml(masterCopy.make)}</td>
                  <td>${escapeHtml(masterCopy.model)}</td>
                  <td>${escapeHtml(masterCopy.serial)}</td>
                  <td>${escapeHtml(masterCopy.size)}</td>
                </tr>
              </tbody>
            </table>
            ${masterCopy.digitalEvidence ? `
              <div style="margin-top: 8px; padding: 8px; background: #f9fafb; border: 1px solid #d1d5db; border-radius: 6px;">
                <strong>Digital Evidence:</strong> ${escapeHtml(masterCopy.digitalEvidence)}
              </div>
            ` : ''}
          </div>
        ` : '<div class="section"><strong>Master Copy:</strong> Not added for this set</div>'}
        ${workingCopy ? `
          <div class="section">
            <strong>Working Copy ${workingCopy.id} Storage Details</strong>
            <table>
              <thead>
                <tr>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Serial Number</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${escapeHtml(workingCopy.make)}</td>
                  <td>${escapeHtml(workingCopy.model)}</td>
                  <td>${escapeHtml(workingCopy.serial)}</td>
                  <td>${escapeHtml(workingCopy.size)}</td>
                </tr>
              </tbody>
            </table>
            ${workingCopy.digitalEvidence ? `
              <div style="margin-top: 8px; padding: 8px; background: #f9fafb; border: 1px solid #d1d5db; border-radius: 6px;">
                <strong>Digital Evidence:</strong> ${escapeHtml(workingCopy.digitalEvidence)}
              </div>
            ` : ''}
          </div>
        ` : '<div class="section"><strong>Working Copy:</strong> Not added for this set</div>'}
        <div class="section">
          <strong>Devices in This Storage Set</strong>
          <table>
            <thead>
              <tr>
                <th style="width: 50px;">#</th>
                <th>Device User / Folder Name</th>
              </tr>
            </thead>
            <tbody>
              ${deviceRows}
            </tbody>
          </table>
        </div>
        <div class="section">
          <strong>Chain of Custody Record</strong>
          <table>
            <thead>
              <tr>
                <th>Reason/Action</th>
                <th>Received From</th>
                <th>Received By</th>
                <th>Date</th>
                <th>Time</th>
                <th>Sign of Receiver</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HANDOVER</td>
                <td>${d.authorizedOfficer}</td>
                <td>${d.examinerName}<br/><small>Digital Forensic Examiner</small></td>
                <td>${d.dateOfSearch}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>HANDOVER</td>
                <td>${d.examinerName}<br/><small>Digital Forensic Examiner</small></td>
                <td>${d.authorizedOfficer}</td>
                <td>${d.conclusionDate}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td colspan="6" style="height: 40px;"></td>
              </tr>
              <tr>
                <td colspan="6" style="height: 40px;"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="section">
          ${renderSignatureTable()}
        </div>
      `;
    }).join("");
    
    return cocDocuments;
  },
  evidence: () => {
    const d = getCommon();
    const devices = getDevices();
    const masterList = getCopyList("master");
    const workingList = getCopyList("working");
    if (!devices.length) {
      return `
        <div class="doc-title">Digital Evidence Collection Form</div>
        <div class="doc-subtitle">Hash & Imaging Record</div>
        <div class="section">No device added.</div>
      `;
    }

    return devices.map((device, idx) => {
      // Find which master and working copies contain this device
      const deviceMasterCopies = state.masterCopies.filter(copy => 
        copy.devices && copy.devices.includes(idx)
      );
      const deviceWorkingCopies = state.workingCopies.filter(copy => 
        copy.devices && copy.devices.includes(idx)
      );
      
      // Collect all digital evidence for this device from its copies
      const masterEvidenceList = deviceMasterCopies
        .filter(copy => copy.digitalEvidence)
        .map(copy => `<div style="margin-bottom: 8px;"><strong>${copy.id}:</strong> ${escapeHtml(copy.digitalEvidence)}</div>`)
        .join("");
      
      const workingEvidenceList = deviceWorkingCopies
        .filter(copy => copy.digitalEvidence)
        .map(copy => `<div style="margin-bottom: 8px;"><strong>${copy.id}:</strong> ${escapeHtml(copy.digitalEvidence)}</div>`)
        .join("");
      
      const copyInfoHTML = (deviceMasterCopies.length > 0 || deviceWorkingCopies.length > 0) ? `
          ${deviceMasterCopies.length > 0 ? `
            <div style="margin-top: 8px;">
              <strong style="font-size: 13px;">Master Copies:</strong>
              <table style="margin-top: 4px;">
                <thead>
                  <tr>
                    <th>Copy ID</th>
                    <th>Make/Model</th>
                    <th>Serial Number</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  ${deviceMasterCopies.map(copy => `
                    <tr>
                      <td>${copy.id}</td>
                      <td>${escapeHtml(copy.make)} ${escapeHtml(copy.model)}</td>
                      <td>${escapeHtml(copy.serial)}</td>
                      <td>${escapeHtml(copy.size)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : ''}
          ${deviceWorkingCopies.length > 0 ? `
            <div style="margin-top: 8px;">
              <strong style="font-size: 13px;">Working Copies:</strong>
              <table style="margin-top: 4px;">
                <thead>
                  <tr>
                    <th>Copy ID</th>
                    <th>Make/Model</th>
                    <th>Serial Number</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  ${deviceWorkingCopies.map(copy => `
                    <tr>
                      <td>${copy.id}</td>
                      <td>${escapeHtml(copy.make)} ${escapeHtml(copy.model)}</td>
                      <td>${escapeHtml(copy.serial)}</td>
                      <td>${escapeHtml(copy.size)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : ''}
          ${(masterEvidenceList || workingEvidenceList) ? `
            <div style="margin-top: 12px; padding: 10px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px;">
              <strong style="font-size: 13px; color: #92400e;">Digital Evidence Details:</strong>
              <div style="margin-top: 8px; font-size: 12px;">
                ${masterEvidenceList ? `<div style="margin-bottom: 8px;"><strong>Master Copies:</strong>${masterEvidenceList}</div>` : ''}
                ${workingEvidenceList ? `<div><strong>Working Copies:</strong>${workingEvidenceList}</div>` : ''}
              </div>
            </div>
          ` : ''}
      ` : `<div style="margin-top: 8px; color: #dc2626; font-size: 13px;">
            ⚠️ This device is not assigned to any master or working copy yet.
          </div>`;
      
      return `
      <section class="page">
        <div class="doc-title">Digital Evidence Collection Form</div>
        <div class="doc-subtitle">Hash & Imaging Record - Device #${idx + 1}</div>
        <div class="section">
          <strong>Hash Value report of Evidence:</strong> ${escapeHtml(device.label || 'Device')}<br/>
            <strong>Name of Authorized Officer:</strong> ${d.authorizedOfficer}<br/>
            <strong>Date:</strong> ${d.dateOfSearch}<br/>
            <strong>Premise Address:</strong> ${d.premiseAddress}<br/>
            <strong>Examiner’s Name and Details:</strong> ${d.examinerName} (Digital Forensic Examiner)<br/>
            <strong>Case Information:</strong> ${d.caseInformation}<br/>
            <strong>Device #:</strong> ${idx + 1}
        </div>
        <div class="section">
          <strong>Evidence Information</strong>
          ${renderDeviceTable([device])}
        </div>
        <div class="section">
          ${renderHashBlock(device)}
        </div>
        ${deviceMasterCopies.length > 0 ? `
          <div class="section">
            <strong>Master Copy Details (for this device)</strong>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Serial</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                ${deviceMasterCopies.map((item, copyIdx) => `
                  <tr>
                    <td>${copyIdx + 1}</td>
                    <td>${escapeHtml(item.make)}</td>
                    <td>${escapeHtml(item.model)}</td>
                    <td>${escapeHtml(item.serial)}</td>
                    <td>${escapeHtml(item.size)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : '<div class="section"><strong>Master Copy Details:</strong> This device is not stored in any master copy.</div>'}
        ${deviceWorkingCopies.length > 0 ? `
          <div class="section">
            <strong>Working Copy Details (for this device)</strong>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Serial</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                ${deviceWorkingCopies.map((item, copyIdx) => `
                  <tr>
                    <td>${copyIdx + 1}</td>
                    <td>${escapeHtml(item.make)}</td>
                    <td>${escapeHtml(item.model)}</td>
                    <td>${escapeHtml(item.serial)}</td>
                    <td>${escapeHtml(item.size)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : '<div class="section"><strong>Working Copy Details:</strong> This device is not stored in any working copy.</div>'}
        ${(masterEvidenceList || workingEvidenceList) ? `
          <div class="section" style="background: #fffbeb; border: 2px solid #fcd34d; border-radius: 8px; padding: 12px;">
            <strong style="color: #92400e;">📋 Digital Evidence Details</strong>
            <div style="margin-top: 8px; font-size: 13px;">
              ${masterEvidenceList ? `<div style="margin-bottom: 8px;"><strong>From Master Copies:</strong><br/>${masterEvidenceList}</div>` : ''}
              ${workingEvidenceList ? `<div><strong>From Working Copies:</strong><br/>${workingEvidenceList}</div>` : ''}
            </div>
          </div>
        ` : ''}
        <div class="section">
          ${renderSignatureTable()}
        </div>
      </section>
    `}).join("");
  },
  job: () => {
    const d = getCommon();
    const devices = getDevices();
    return `
      <div class="doc-title">JOB FORM</div>
      <table style="margin-bottom:16px;">
        <thead>
          <tr>
            <th>Team Code</th>
            <th>Date of Submission</th>
            <th>Examiner Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${state.includeTeamCode && state.teamCode ? escapeHtml(state.teamCode) : ''}</td>
            <td>${d.conclusionDate}</td>
            <td>${d.examinerName}</td>
          </tr>
        </tbody>
      </table>
      <div class="section" style="border:1px solid #333;padding:8px;margin-bottom:8px;">
        <strong>Name & Title of the Person from whom received authorization</strong><br/>
        ${d.authorizedOfficer}
      </div>
      <div class="section" style="border:1px solid #333;padding:8px;margin-bottom:8px;">
        <strong>File Number & Address</strong><br/>
        ${d.caseInformation}<br/>
        ${d.premiseAddress}
      </div>
      <div class="section" style="border:1px solid #333;padding:8px;margin-bottom:8px;">
        <strong>Purpose for which obtained</strong><br/>
        <div style="display:flex;gap:20px;margin-top:4px;">
          <label style="display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #333;border-radius:50%;${state.jobPurpose === 'Evidence' ? 'background:#333;' : ''}"></span>
            Evidence
          </label>
          <label style="display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #333;border-radius:50%;${state.jobPurpose === 'Found' ? 'background:#333;' : ''}"></span>
            Found
          </label>
          <label style="display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #333;border-radius:50%;${state.jobPurpose === 'Impounded' ? 'background:#333;' : ''}"></span>
            Impounded
          </label>
          <label style="display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #333;border-radius:50%;${state.jobPurpose === 'Others' ? 'background:#333;' : ''}"></span>
            Others
          </label>
        </div>
      </div>
      <div class="section">
        ${renderJobDeviceTable(devices)}
      </div>
      ${state.workstationsUsed ? `<div class="section" style="border:1px solid #333;padding:8px;margin-bottom:8px;">
        <strong>NOTE: ${escapeHtml(state.workstationsUsed).toUpperCase()} WORKSTATIONS USED IN PREMISE</strong>
      </div>` : ""}
      ${state.includeReviewAnalysis ? `<div class="section">
        <strong>Review & Analysis</strong><br/>
        Start Date: ${d.dateOfSearch}<br/>
        End Date: ${d.conclusionDate}
      </div>` : ""}
      <div class="section">
        <table>
          <thead>
            <tr>
              <th>Authorize Officer</th>
              <th>Forensic Investigator</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="height:60px"></td>
              <td style="height:60px"></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },
  sticker: () => {
    const d = getCommon();
    const devices = getDevices();
    
    // Generate stickers for all working copies
    const workingStickers = state.workingCopies.map((copy, idx) => {
      const copyDevices = copy.devices && copy.devices.length 
        ? copy.devices.map(devIdx => {
            const device = devices[devIdx];
            if (!device) return '';
            // Use device label (folder name) as per user requirement
            const deviceLabel = device.label || `Device #${devIdx + 1}`;
            return `<div>${devIdx + 1}. ${escapeHtml(deviceLabel)}</div>`;
          }).filter(Boolean).join("")
        : "<div>No devices assigned to this copy.</div>";
      
      return `
        <div class="section sticker-box">
          <strong>WORKING COPY ${copy.id} (Serial Number - ${escapeHtml(copy.serial)})</strong><br/>
          <div style="margin-top: 8px;"><strong>Storage:</strong> ${escapeHtml(copy.make)} ${escapeHtml(copy.model)} | ${escapeHtml(copy.size)}</div>
          <div style="margin-top: 8px;">In the case of ${d.caseInformation}. DOS: ${d.dateOfSearch}</div>
          <div style="margin-top: 8px;">This storage medium contains the imaged data of the following devices:</div>
          ${copyDevices}
          ${copy.digitalEvidence ? `<div style="margin-top: 8px; padding: 8px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 4px;"><strong>Digital Evidence:</strong><br/>${escapeHtml(copy.digitalEvidence)}</div>` : ''}
          <div style="margin-top:12px;">
            <div class="signature">W-1 ____________________</div>
            <div class="signature">Party - ${d.partyName}</div>
            <div class="signature">W-2 ____________________</div>
            <div class="signature">AO - ${d.authorizedOfficer}</div>
          </div>
        </div>
      `;
    }).join("");
    
    // Generate stickers for all master copies
    const masterStickers = state.masterCopies.map((copy, idx) => {
      const copyDevices = copy.devices && copy.devices.length 
        ? copy.devices.map(devIdx => {
            const device = devices[devIdx];
            if (!device) return '';
            // Use device label (folder name) as per user requirement
            const deviceLabel = device.label || `Device #${devIdx + 1}`;
            return `<div>${devIdx + 1}. ${escapeHtml(deviceLabel)}</div>`;
          }).filter(Boolean).join("")
        : "<div>No devices assigned to this copy.</div>";
      
      return `
        <div class="section sticker-box">
          <strong>MASTER COPY ${copy.id} (Serial Number - ${escapeHtml(copy.serial)})</strong><br/>
          <div style="margin-top: 8px;"><strong>Storage:</strong> ${escapeHtml(copy.make)} ${escapeHtml(copy.model)} | ${escapeHtml(copy.size)}</div>
          <div style="margin-top: 8px;">In the case of ${d.caseInformation}. DOS: ${d.dateOfSearch}</div>
          <div style="margin-top: 8px;">This storage medium contains the imaged data of the following devices:</div>
          ${copyDevices}
          ${copy.digitalEvidence ? `<div style="margin-top: 8px; padding: 8px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 4px;"><strong>Digital Evidence:</strong><br/>${escapeHtml(copy.digitalEvidence)}</div>` : ''}
          <div style="margin-top:12px;">
            <div class="signature">W-1 ____________________</div>
            <div class="signature">Party - ${d.partyName}</div>
            <div class="signature">W-2 ____________________</div>
            <div class="signature">AO - ${d.authorizedOfficer}</div>
          </div>
        </div>
      `;
    }).join("");
    
    // Fallback to old single sticker format if no copies are added
    const fallbackSticker = (!state.workingCopies.length && !state.masterCopies.length) ? `
      <div class="section" style="padding: 20px; background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; text-align: center;">
        <strong>⚠️ No master or working copies added yet</strong><br/>
        <span style="font-size: 12px; color: #92400e;">Please add master and working copies in the form above to generate proper stickers.</span>
      </div>
      <div class="section sticker-box">
        <strong>WORKING COPY (Serial Number - ${d.stickerWorkingSerial})</strong><br/>
        In the case of ${d.caseInformation}. DOS: ${d.dateOfSearch}<br/>
        This storage medium contains the imaged data of the following devices:
        ${devices.map((device, idx) => `<div>${idx + 1}. ${escapeHtml(device.name || 'Device')}</div>`).join("") || "<div>No devices added.</div>"}
        <div style="margin-top:12px;">
          <div class="signature">W-1 ____________________</div>
          <div class="signature">Party - ${d.partyName}</div>
          <div class="signature">W-2 ____________________</div>
          <div class="signature">AO - ${d.authorizedOfficer}</div>
        </div>
      </div>
      <div class="section sticker-box">
        <strong>MASTER COPY (Serial Number - ${d.stickerMasterSerial})</strong><br/>
        In the case of ${d.caseInformation}. DOS: ${d.dateOfSearch}<br/>
        This storage medium contains the imaged data of the following devices:
        ${devices.map((device, idx) => `<div>${idx + 1}. ${escapeHtml(device.name || 'Device')}</div>`).join("") || "<div>No devices added.</div>"}
        <div style="margin-top:12px;">
          <div class="signature">W-1 ____________________</div>
          <div class="signature">Party - ${d.partyName}</div>
          <div class="signature">W-2 ____________________</div>
          <div class="signature">AO - ${d.authorizedOfficer}</div>
        </div>
      </div>
    ` : '';
    
    return `
      <div class="doc-title">Working / Master Stickers</div>
      <div class="doc-subtitle">Device Imaging Identification</div>
      ${workingStickers}
      ${masterStickers}
      ${fallbackSticker}
      <div class="section">
        ${renderSignatureTable()}
      </div>
    `;
  }
  ,
  custom: () => renderCustomDoc()
};

const renderPreview = () => {
  const active = document.querySelector(".tab.active")?.dataset.doc || "cert63";
  let html = templates[active] ? templates[active]() : "";
  html = html.replaceAll("<!--PAGEBREAK-->", "<div class=\"page-sep\">Page Break</div>");
  document.getElementById("preview").innerHTML = html;
  const caseEl = document.getElementById("metaCase");
  const dateEl = document.getElementById("metaDate");
  const devicesEl = document.getElementById("metaDevices");
  const customEl = document.getElementById("metaCustom");
  if (caseEl) caseEl.textContent = `Case: ${state.caseInformation || "—"}`;
  if (dateEl) dateEl.textContent = `DOS: ${state.dateOfSearch ? formatDate(state.dateOfSearch) : "—"}`;
  if (devicesEl) devicesEl.textContent = `Devices: ${getDevices().length}`;
  if (customEl) customEl.textContent = `Custom: ${state.customEnabled ? "On" : "Off"}`;
};

const bindInputs = () => {
  document.querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
      state[input.id] = input.type === "checkbox" ? input.checked : input.value;
      renderPreview();
    });
  });
};

const bindTabs = () => {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderPreview();
    });
  });
};

// Helper function to restore form interactivity
const restoreFormInteractivity = (focusElementId) => {
  // Force window focus first
  window.focus();
  
  setTimeout(() => {
    requestAnimationFrame(() => {
      // Force document focus
      if (document.hasFocus && !document.hasFocus()) {
        window.focus();
      }
      
      // Re-enable all inputs
      document.querySelectorAll('input, textarea, select, button').forEach(el => {
        el.removeAttribute('disabled');
        el.style.pointerEvents = 'auto';
      });
      
      // Focus on specific field if provided
      if (focusElementId) {
        const field = document.getElementById(focusElementId);
        if (field) {
          field.focus();
          if (field.select) field.select();
        }
      }
    });
  }, 50);
};

const bindDeviceList = () => {
  const btn = document.getElementById("btn-add-device");
  const clearBtn = document.getElementById("btn-clear-device");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent multiple rapid clicks
    if (btn.disabled) return;
    
    try {
      const device = {
        label: state.deviceLabel,
        type: state.deviceType,
        name: state.deviceName,
        make: state.deviceMake,
        size: state.deviceSize,
        model: state.deviceModelNo,
        serial: state.deviceSerialNo,
        imei1: state.deviceImei1,
        imei2: state.deviceImei2,
        useType: state.useDeviceType,
        useName: state.useDeviceName,
        useMake: state.useMake,
        useModel: state.useModel,
        useSerial: state.useSerial,
        useSize: state.useSize,
        useImei1: state.useImei1,
        useImei2: state.useImei2,
        hashType: state.hashType,
        md5: state.hashMd5,
        sha1: state.hashSha1,
        sha256: state.hashSha256,
        imagingSoftware: state.imagingSoftware,
        action: state.actionTaken
      };
      
      if (!device.label) {
        alert("⚠️ Device User / Folder Name is required!");
        restoreFormInteractivity("deviceLabel");
        return;
      }
      
      // Check for duplicate device label (must be unique)
      const duplicateLabel = state.deviceList.find((d, idx) => 
        d.label && d.label.toLowerCase() === device.label.toLowerCase() && 
        idx !== state.editingDeviceIndex
      );
      if (duplicateLabel) {
        alert("⚠️ Error: Device User / Folder Name must be unique!\n\nThis name is already used by another device. Please choose a different name.");
        restoreFormInteractivity("deviceLabel");
        return;
      }
      
      // Check for duplicate hash values (MD5, SHA1, or SHA256)
      const duplicateHash = state.deviceList.find((d, idx) => {
        if (idx === state.editingDeviceIndex) return false;
        
        // Check MD5
        if (device.md5 && d.md5 && device.md5.toLowerCase() === d.md5.toLowerCase()) {
          return true;
        }
        // Check SHA1
        if (device.sha1 && d.sha1 && device.sha1.toLowerCase() === d.sha1.toLowerCase()) {
          return true;
        }
        // Check SHA256
        if (device.sha256 && d.sha256 && device.sha256.toLowerCase() === d.sha256.toLowerCase()) {
          return true;
        }
        return false;
      });
      
      if (duplicateHash) {
        alert("⚠️ Error: Duplicate Hash Value Detected!\n\nThere cannot be two devices with the same hash value. Each device must have unique hash values (MD5, SHA1, or SHA256).\n\nPlease verify the hash values and ensure they are correct.");
        restoreFormInteractivity("hashMd5");
        return;
      }
      
      if (state.editingDeviceIndex >= 0) {
        // Update existing device
        state.deviceList[state.editingDeviceIndex] = device;
        state.editingDeviceIndex = -1;
        btn.textContent = "✅ Add Device to Case";
      } else {
        // Add new device
        state.deviceList.push(device);
      }
      
      // Clear the form after successful addition
      state.deviceLabel = "";
      document.getElementById("deviceLabel").value = "";
      
      renderDeviceList();
      renderCopyLists(); // Update device selectors in copy lists
      renderPreview();
    } catch (error) {
      console.error("Error adding device:", error);
      alert("An error occurred. Please try again.");
      restoreFormInteractivity();
    }
  });
  clearBtn.addEventListener("click", () => {
    state.editingDeviceIndex = -1;
    document.getElementById("btn-add-device").textContent = "✅ Add Device to Case";
    [
      "deviceLabel",
      "deviceType",
      "deviceName",
      "deviceMake",
      "deviceSize",
      "deviceModelNo",
      "deviceSerialNo",
      "deviceImei1",
      "deviceImei2",
      "hashMd5",
      "hashSha1",
      "hashSha256",
      "imagingSoftware",
      "actionTaken"
    ].forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = "";
        state[id] = "";
      }
    });
    // Reset field toggles to defaults
    state.useDeviceType = false;
    state.useDeviceName = false;
    state.useMake = true;
    state.useModel = true;
    state.useSerial = true;
    state.useSize = true;
    state.useImei1 = false;
    state.useImei2 = false;
    document.getElementById("useDeviceType").checked = false;
    document.getElementById("useDeviceName").checked = false;
    document.getElementById("useMake").checked = true;
    document.getElementById("useModel").checked = true;
    document.getElementById("useSerial").checked = true;
    document.getElementById("useSize").checked = true;
    document.getElementById("useImei1").checked = false;
    document.getElementById("useImei2").checked = false;
    toggleFieldVisibility();
    document.querySelector('input[name="hashType"][value="md5sha1"]').checked = true;
    state.hashType = "md5sha1";
    toggleHashFields();
    renderPreview();
  });
};

const toggleHashFields = () => {
  const hashType = document.querySelector('input[name="hashType"]:checked')?.value || "md5sha1";
  const md5Field = document.getElementById("hashMd5")?.closest("label");
  const sha1Field = document.getElementById("hashSha1")?.closest("label");
  const sha256Field = document.getElementById("hashSha256")?.closest("label");
  
  if (hashType === "md5sha1") {
    md5Field.style.display = "";
    sha1Field.style.display = "";
    sha256Field.style.display = "none";
  } else {
    md5Field.style.display = "none";
    sha1Field.style.display = "none";
    sha256Field.style.display = "";
  }
};

const toggleFieldVisibility = () => {
  // Show/hide field wrappers based on checkbox states
  const fieldMappings = [
    { checkboxId: 'useDeviceType', fieldName: 'deviceType' },
    { checkboxId: 'useDeviceName', fieldName: 'deviceName' },
    { checkboxId: 'useMake', fieldName: 'deviceMake' },
    { checkboxId: 'useModel', fieldName: 'deviceModelNo' },
    { checkboxId: 'useSerial', fieldName: 'deviceSerialNo' },
    { checkboxId: 'useSize', fieldName: 'deviceSize' },
    { checkboxId: 'useImei1', fieldName: 'deviceImei1' },
    { checkboxId: 'useImei2', fieldName: 'deviceImei2' }
  ];
  
  fieldMappings.forEach(({ checkboxId, fieldName }) => {
    const checkbox = document.getElementById(checkboxId);
    const fieldWrapper = document.querySelector(`[data-field-name="${fieldName}"]`);
    if (checkbox && fieldWrapper) {
      fieldWrapper.style.display = checkbox.checked ? '' : 'none';
    }
  });
};

const bindCopyControls = () => {
  const addMaster = document.getElementById("btn-add-master");
  const addWorking = document.getElementById("btn-add-working");
  const clearCopies = document.getElementById("btn-clear-copies");

  addMaster?.addEventListener("click", () => {
    const item = {
      make: state.masterCopyMake,
      model: state.masterCopyModel,
      serial: state.masterCopySerial,
      size: state.masterCopySize,
      id: `M-${state.masterCopies.length}`,
      devices: [],
      digitalEvidence: ""
    };
    if (!item.make && !item.model && !item.serial && !item.size) return;
    state.masterCopies.push(item);
    // Clear form fields
    state.masterCopyMake = "";
    state.masterCopyModel = "";
    state.masterCopySerial = "";
    state.masterCopySize = "";
    document.getElementById("masterCopyMake").value = "";
    document.getElementById("masterCopyModel").value = "";
    document.getElementById("masterCopySerial").value = "";
    document.getElementById("masterCopySize").value = "";
    renderCopyLists();
    renderPreview();
  });

  addWorking?.addEventListener("click", () => {
    const item = {
      make: state.workingCopyMake,
      model: state.workingCopyModel,
      serial: state.workingCopySerial,
      size: state.workingCopySize,
      id: `W-${state.workingCopies.length}`,
      devices: [],
      digitalEvidence: ""
    };
    if (!item.make && !item.model && !item.serial && !item.size) return;
    state.workingCopies.push(item);
    // Clear form fields
    state.workingCopyMake = "";
    state.workingCopyModel = "";
    state.workingCopySerial = "";
    state.workingCopySize = "";
    document.getElementById("workingCopyMake").value = "";
    document.getElementById("workingCopyModel").value = "";
    document.getElementById("workingCopySerial").value = "";
    document.getElementById("workingCopySize").value = "";
    renderCopyLists();
    renderPreview();
  });

  clearCopies?.addEventListener("click", () => {
    [
      "masterCopyMake",
      "masterCopyModel",
      "masterCopySerial",
      "masterCopySize",
      "workingCopyMake",
      "workingCopyModel",
      "workingCopySerial",
      "workingCopySize"
    ].forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.value = "";
        state[id] = "";
      }
    });
  });
};

const getPagesFromContent = (content) => {
  if (content.includes("class=\"page\"")) {
    const matches = content.match(/<section class="page">[\s\S]*?<\/section>/g);
    if (matches && matches.length) {
      return matches.map((section) => section.replace("<section class=\"page\">", "").replace("</section>", ""));
    }
  }
  if (content.includes("<!--PAGEBREAK-->")) {
    return content.split("<!--PAGEBREAK-->");
  }
  return [content];
};

const wrapPagesWithHeaderFooter = (pages) => {
  return pages.map((content, index) => `
    <section class="page">
      ${content}
    </section>
  `).join("");
};

const downloadCurrent = () => {
  const active = document.querySelector(".tab.active")?.dataset.doc || "cert63";
  const html = templates[active] ? templates[active]() : "";
  const docName = {
    cert63: "63A-certificate",
    coc: "chain-of-custody",
    evidence: "evidence-collection",
    job: "job-form",
    sticker: "working-master-sticker"
  }[active];

  const pages = getPagesFromContent(html);
  const body = wrapPagesWithHeaderFooter(pages);

  const blob = new Blob([
    `<!doctype html><html><head><meta charset='utf-8'>`,
    `<title>${docName}</title>`,
    getPrintStyles(),
    `</head><body>${body}</body></html>`
  ], { type: "text/html" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${docName}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

const getPrintStyles = () => `
  <style>
    body{font-family:Georgia,serif;line-height:1.5;padding:32px;color:#111;margin:0;}
    h1,h2,h3{margin:0 0 8px;text-align:center;}
    .doc-title{font-size:20px;font-weight:700;text-align:center;margin:0 0 6px;}
    .doc-subtitle{font-size:12px;text-align:center;margin:0 0 16px;letter-spacing:0.08em;text-transform:uppercase;}
    .section{margin-bottom:16px;}
    table{width:100%;border-collapse:collapse;margin-top:8px;}
    th,td{border:1px solid #333;padding:6px;font-size:12px;text-align:left;}
    .meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 18px;font-size:13px;}
    .meta-grid div{padding:6px 8px;border:1px solid #999;}
    .signature{border-top:1px solid #333;padding-top:8px;}
    .hash-block{border:2px solid #333;background:#f8f1e8;padding:10px 12px;border-radius:8px;margin-top:10px;}
    .hash-title{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;}
    .hash-row{display:grid;grid-template-columns:100px 1fr;gap:8px;font-size:11px;}
    .hash-row span{font-weight:600;}
    .doc-box{border:2px solid #333;padding:14px;border-radius:10px;background:#fffef9;}
    .sticker-box{border:2px dashed #333;padding:12px;border-radius:10px;background:#fff8ee;margin-bottom:12px;}
    .page{page-break-after:always;margin:0;padding:0;}
    .page:last-child{page-break-after:auto;}
    .page-sep{page-break-before:always;display:none;margin:0;padding:0;height:0;}
    @page{margin:0.5in;size:auto;}
  </style>
`;

const exportPrintPack = () => {
  const docs = [
    "cert63",
    "coc",
    "evidence",
    "job",
    "sticker",
    state.customEnabled ? "custom" : null
  ].filter(Boolean);
  const pages = docs.flatMap((key) => {
    const content = templates[key] ? templates[key]() : "";
    return getPagesFromContent(content);
  });
  const body = wrapPagesWithHeaderFooter(pages);
  const html = `<!doctype html><html><head><meta charset="utf-8">${getPrintStyles()}</head><body>${body}</body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};

const exportPrintCurrent = () => {
  const active = document.querySelector(".tab.active")?.dataset.doc || "cert63";
  const html = templates[active] ? templates[active]() : "";
  const pages = getPagesFromContent(html);
  const body = wrapPagesWithHeaderFooter(pages);
  const htmlDoc = `<!doctype html><html><head><meta charset="utf-8">${getPrintStyles()}</head><body>${body}</body></html>`;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.open();
  win.document.write(htmlDoc);
  win.document.close();
  win.focus();
  win.print();
};

const getWordStyles = () => `
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page WordSection1 {
      size: 8.5in 11in;
      margin: 0.5in 0.5in 0.5in 0.5in;
      mso-header-margin: 0.5in;
      mso-footer-margin: 0.5in;
      mso-paper-source: 0;
    }
    div.WordSection1 {
      page: WordSection1;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000000;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3 {
      font-family: 'Times New Roman', Times, serif;
      margin: 0 0 10pt;
      text-align: center;
      color: #000000;
    }
    .doc-title {
      font-size: 16pt;
      font-weight: bold;
      text-align: center;
      margin: 0 0 6pt;
      text-transform: uppercase;
    }
    .doc-subtitle {
      font-size: 11pt;
      text-align: center;
      margin: 0 0 12pt;
      letter-spacing: 1pt;
      text-transform: uppercase;
    }
    .section {
      margin-bottom: 12pt;
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0;
      font-size: 11pt;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      mso-table-anchor-vertical: paragraph;
      mso-table-anchor-horizontal: column;
      mso-table-left: left;
      mso-table-top: top;
    }
    th, td {
      border: 1pt solid #000000;
      padding: 4pt 6pt;
      font-size: 11pt;
      text-align: left;
      vertical-align: top;
      mso-border-alt: solid black 0.5pt;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
      mso-shading: white;
      mso-pattern: gray-10 auto;
    }
    .meta-grid {
      display: block;
      margin-bottom: 10pt;
    }
    .meta-grid div {
      padding: 6pt 8pt;
      border: 1pt solid #666666;
      margin-bottom: 6pt;
      page-break-inside: avoid;
    }
    .signature {
      border-top: 1pt solid #000000;
      padding-top: 8pt;
      margin-top: 10pt;
      page-break-inside: avoid;
    }
    .hash-block {
      border: 2pt solid #000000;
      background-color: #f8f1e8;
      padding: 10pt 12pt;
      margin-top: 10pt;
      page-break-inside: avoid;
    }
    .hash-title {
      font-size: 10pt;
      font-weight: bold;
      letter-spacing: 0.5pt;
      text-transform: uppercase;
      margin-bottom: 6pt;
    }
    .hash-row {
      margin-bottom: 4pt;
      font-size: 10pt;
    }
    .hash-row span {
      font-weight: bold;
      display: inline-block;
      width: 100pt;
    }
    .doc-box {
      border: 2pt solid #000000;
      padding: 12pt;
      background-color: #fffef9;
      margin-bottom: 10pt;
      page-break-inside: avoid;
    }
    .sticker-box {
      border: 2pt dashed #000000;
      padding: 12pt;
      background-color: #fff8ee;
      margin-bottom: 12pt;
      page-break-inside: avoid;
    }
    .page {
      page-break-after: always;
    }
    .page:last-child {
      page-break-after: auto;
    }
    .page-sep {
      page-break-before: always;
      height: 0;
      margin: 0;
      padding: 0;
      visibility: hidden;
    }
    p {
      margin: 0 0 10pt;
      line-height: 1.5;
    }
    strong {
      font-weight: bold;
    }
    /* Word-specific formatting */
    @page {
      mso-page-orientation: portrait;
    }
  </style>
`;

const exportWordPack = () => {
  const docs = [
    "cert63",
    "coc",
    "evidence",
    "job",
    "sticker",
    state.customEnabled ? "custom" : null
  ].filter(Boolean);
  const pages = docs.flatMap((key) => {
    const content = templates[key] ? templates[key]() : "";
    return getPagesFromContent(content);
  });
  const body = pages.map((content, index) => `
    <div class="page">
      ${content}
    </div>
    ${index < pages.length - 1 ? '<br clear=all style="page-break-before:always">' : ''}
  `).join("");
  const html = `
    <html xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="ProgId" content="Word.Document">
        <meta name="Generator" content="Microsoft Word 15">
        <meta name="Originator" content="Microsoft Word 15">
        <title>Forensic Documents</title>
        ${getWordStyles()}
      </head>
      <body lang=EN-US style='tab-interval:.5in'>
        <div class="WordSection1">
          ${body}
        </div>
      </body>
    </html>
  `;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "forensic-documents.doc";
  a.click();
  URL.revokeObjectURL(url);
};

const exportWordCurrent = () => {
  const active = document.querySelector(".tab.active")?.dataset.doc || "cert63";
  const html = templates[active] ? templates[active]() : "";
  const docName = {
    cert63: "63A-certificate",
    coc: "chain-of-custody",
    evidence: "evidence-collection",
    job: "job-form",
    sticker: "working-master-sticker"
  }[active];
  const pages = getPagesFromContent(html);
  const body = pages.map((content, index) => `
    <div class="page">
      ${content}
    </div>
    ${index < pages.length - 1 ? '<br clear=all style="page-break-before:always">' : ''}
  `).join("");
  const htmlDoc = `
    <html xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="ProgId" content="Word.Document">
        <meta name="Generator" content="Microsoft Word 15">
        <meta name="Originator" content="Microsoft Word 15">
        <title>${docName}</title>
        ${getWordStyles()}
      </head>
      <body lang=EN-US style='tab-interval:.5in'>
        <div class="WordSection1">
          ${body}
        </div>
      </body>
    </html>
  `;
  const blob = new Blob([htmlDoc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${docName}.doc`;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadJson = () => {
  const payload = {
    ...state,
    dateOfSearch: state.dateOfSearch,
    conclusionDate: state.conclusionDate
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "case-data.json";
  a.click();
  URL.revokeObjectURL(url);
};

const printCurrent = () => {
  window.print();
};

bindInputs();
bindTabs();
bindDeviceList();
bindCopyControls();
renderDeviceList();
renderCopyLists();
renderPreview();

// Add global focus restoration to prevent Electron alert focus issues
window.addEventListener('focus', () => {
  // Re-enable all form elements when window regains focus
  setTimeout(() => {
    document.querySelectorAll('input, textarea, select, button').forEach(el => {
      el.removeAttribute('disabled');
      el.style.pointerEvents = 'auto';
    });
  }, 10);
});

// Handle visibility change (for when user clicks back to the app)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    window.focus();
    setTimeout(() => {
      document.querySelectorAll('input, textarea, select, button').forEach(el => {
        el.removeAttribute('disabled');
        el.style.pointerEvents = 'auto';
      });
    }, 10);
  }
});

// Restore interactivity on any click (safety net for Electron alert issues)
document.body.addEventListener('click', () => {
  if (!document.hasFocus || !document.hasFocus()) {
    window.focus();
  }
}, { capture: true });

// Hash type toggle
document.querySelectorAll('input[name="hashType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    state.hashType = radio.value;
    toggleHashFields();
  });
});
toggleHashFields();

// Field visibility toggles
document.querySelectorAll('.field-toggle').forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    const stateKey = e.target.id; // e.g., 'useMake'
    state[stateKey] = e.target.checked;
    toggleFieldVisibility();
  });
});
toggleFieldVisibility();

const customDocxInput = document.getElementById("customDocx");
customDocxInput?.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  state.customDocxName = file ? file.name : "";
  const statusEl = document.getElementById("customDocxStatus");
  if (statusEl) statusEl.textContent = state.customDocxName || "No file selected.";
  renderPreview();
});

// Platform detection - works for both Electron and Tauri
const isElectron = () => Boolean(window.electron);
const isTauri = () => Boolean(window.__TAURI__);
const isDesktop = () => isElectron() || isTauri();

// Extract DOCX using platform-specific API
const extractDocxDesktop = async (path) => {
  if (isElectron()) {
    const data = await window.electron.extractDocx(path);
    if (data.error) throw new Error(data.error);
    return data;
  } else if (isTauri()) {
    const { invoke } = window.__TAURI__.core;
    const result = await invoke('extract_docx', { path });
    return { text: result };
  }
  throw new Error("Desktop features not available");
};

// Open file dialog using platform-specific API
const openFileDialog = async (options) => {
  if (isElectron()) {
    return await window.electron.openFile(options);
  } else if (isTauri()) {
    const { open } = window.__TAURI__.dialog;
    const selected = await open({
      multiple: false,
      filters: options.filters || [],
      title: options.title || "Select File"
    });
    if (!selected) {
      return { canceled: true, filePaths: [] };
    }
    return { canceled: false, filePaths: [selected] };
  }
  throw new Error("File dialog not available");
};

const bindDesktopDocx = () => {
  const btn = document.getElementById("btn-custom-docx");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    if (!isDesktop()) {
      alert("Desktop DOCX selection is available only in the desktop app.");
      return;
    }
    try {
      const result = await openFileDialog({ 
        filters: [{ name: "DOCX Files", extensions: ["docx"] }],
        title: "Select DOCX Template"
      });
      if (result.canceled || !result.filePaths[0]) return;
      const path = result.filePaths[0];
      const data = await extractDocxDesktop(path);
      state.customDocxName = path.split(/[\\/]/).pop() || "selected.docx";
      const statusEl = document.getElementById("customDocxStatus");
      if (statusEl) statusEl.textContent = state.customDocxName;
      // Auto-fill template with extracted text for quick editing
      if (data.text) {
        state.customTemplate = data.text;
        const textarea = document.getElementById("customTemplate");
        if (textarea) textarea.value = data.text;
      }
      renderPreview();
    } catch (err) {
      alert(`DOCX extraction failed: ${err.message}`);
    }
  });
};

// Initialize desktop features when ready
const initDesktopFeatures = async () => {
  // Wait for Tauri to be ready if in Tauri environment
  if (window.__TAURI_INTERNALS__) {
    let attempts = 0;
    while (!window.__TAURI__ && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    if (!window.__TAURI__) {
      console.error('Tauri API failed to load');
      return;
    }
    console.log('Tauri ready, initializing desktop features');
  }
  bindDesktopDocx();
};

// Call initialization
initDesktopFeatures();

document.getElementById("btn-export").addEventListener("click", downloadCurrent);
document.getElementById("btn-print").addEventListener("click", printCurrent);
document.getElementById("btn-pack").addEventListener("click", exportPrintPack);
document.getElementById("btn-pdf-one").addEventListener("click", exportPrintCurrent);
document.getElementById("btn-pdf-all").addEventListener("click", exportPrintPack);
document.getElementById("btn-docx-one").addEventListener("click", exportWordCurrent);
document.getElementById("btn-docx-all").addEventListener("click", exportWordPack);
const jsonBtn = document.createElement("button");
jsonBtn.className = "btn btn-ghost";
jsonBtn.textContent = "Export Case JSON";
jsonBtn.addEventListener("click", downloadJson);
document.querySelector(".top-actions").appendChild(jsonBtn);
