const ADMIN_CREDENTIALS = { username: "admin", password: "LWS@123" };
const VALID_BATCH_CODES = ["LWS-PLAN-A", "LWS-PLAN-B"];

const state = {
  students: [
    { id: "s1", name: "Riya Das", batchCode: "LWS-PLAN-A" },
    { id: "s2", name: "Aman Gupta", batchCode: "LWS-PLAN-B" },
  ],
  contents: [
    {
      id: "c1",
      title: "Interview Confidence Session",
      batchCode: "LWS-PLAN-A",
      type: "video",
      source: "https://www.youtube.com/embed/HAnw168huqA",
      text: "",
    },
    {
      id: "c2",
      title: "Pronunciation Drill Audio",
      batchCode: "LWS-PLAN-A",
      type: "audio",
      source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      text: "",
    },
    {
      id: "c3",
      title: "Grammar Quick Notes PDF",
      batchCode: "LWS-PLAN-A",
      type: "pdf",
      source: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      text: "",
    },
    {
      id: "c4",
      title: "Email Writing Resource",
      batchCode: "LWS-PLAN-B",
      type: "document",
      source: "https://www.w3.org/TR/PNG/iso_8859-1.txt",
      text: "",
    },
    {
      id: "c5",
      title: "Meeting English Markdown Module",
      batchCode: "LWS-PLAN-B",
      type: "markdown",
      source: "",
      text: "# Meeting Confidence\n\n- Open with a clear greeting\n- Use short, direct sentences\n- End with action points",
    },
    {
      id: "c6",
      title: "Spoken English Tips (TTS)",
      batchCode: "LWS-PLAN-A",
      type: "text",
      source: "",
      text: "Practice 10 minutes daily. Focus on clarity over speed. Record and review your speech.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "Which is best for interview introductions?",
      options: ["Very long answer", "Short and clear answer", "No introduction"],
      answer: "Short and clear answer",
    },
    {
      id: "q2",
      question: "B2-C1 Business English is in:",
      options: ["Plan A", "Plan B", "Both plans"],
      answer: "Plan B",
    },
  ],
  flashcards: [
    { front: "SOP", back: "Statement of Purpose" },
    { front: "Accent clarity", back: "Pronunciation with clear sounds" },
    { front: "Mock test", back: "Practice test before final exam/interview" },
  ],
  matching: [
    { left: "Interview fear", right: "Confidence speaking drills" },
    { left: "Grammar gaps", right: "Targeted correction exercises" },
    { left: "Busy schedule", right: "Flexible online sessions" },
  ],
  currentUser: null,
};

const el = {
  adminTab: document.getElementById("admin-tab"),
  studentTab: document.getElementById("student-tab"),
  adminForm: document.getElementById("admin-login-form"),
  studentForm: document.getElementById("student-login-form"),
  authMessage: document.getElementById("auth-message"),
  authSection: document.getElementById("auth-section"),
  adminSection: document.getElementById("admin-section"),
  studentSection: document.getElementById("student-section"),
  adminLogout: document.getElementById("admin-logout"),
  studentLogout: document.getElementById("student-logout"),

  studentManageForm: document.getElementById("student-manage-form"),
  studentEditId: document.getElementById("student-edit-id"),
  studentManageName: document.getElementById("student-manage-name"),
  studentManageBatch: document.getElementById("student-manage-batch"),
  studentFormReset: document.getElementById("student-form-reset"),
  studentsList: document.getElementById("students-list"),

  contentManageForm: document.getElementById("content-manage-form"),
  contentEditId: document.getElementById("content-edit-id"),
  contentTitle: document.getElementById("content-title"),
  contentBatch: document.getElementById("content-batch"),
  contentType: document.getElementById("content-type"),
  contentSource: document.getElementById("content-source"),
  contentText: document.getElementById("content-text"),
  contentFormReset: document.getElementById("content-form-reset"),
  contentList: document.getElementById("content-list"),

  studentProfile: document.getElementById("student-profile"),
  studentContent: document.getElementById("student-content"),
  taskResponse: document.getElementById("task-response"),
  submitTask: document.getElementById("submit-task"),
  taskMessage: document.getElementById("task-message"),
  quizContainer: document.getElementById("quiz-container"),
  submitQuiz: document.getElementById("submit-quiz"),
  quizResult: document.getElementById("quiz-result"),
  flashcards: document.getElementById("flashcards"),
  matching: document.getElementById("matching"),
  checkMatching: document.getElementById("check-matching"),
  matchingResult: document.getElementById("matching-result"),
};

function setMessage(node, text, type = "") {
  node.textContent = text;
  node.className = `message ${type}`.trim();
}

function switchAuthTab(tab) {
  const isAdmin = tab === "admin";
  el.adminTab.classList.toggle("active", isAdmin);
  el.studentTab.classList.toggle("active", !isAdmin);
  el.adminForm.classList.toggle("active", isAdmin);
  el.studentForm.classList.toggle("active", !isAdmin);
  setMessage(el.authMessage, "");
}

function renderBatchOptions() {
  const options = VALID_BATCH_CODES.map((code) => `<option value="${code}">${code}</option>`).join("");
  el.studentManageBatch.innerHTML = options;
  el.contentBatch.innerHTML = options;
}

function renderStudents() {
  if (!state.students.length) {
    el.studentsList.innerHTML = "<li>No students available.</li>";
    return;
  }

  el.studentsList.innerHTML = state.students
    .map(
      (s) => `
      <li>
        <strong>${escapeHTML(s.name)}</strong> — ${escapeHTML(s.batchCode)}
        <div class="actions">
          <button data-student-edit="${s.id}">Edit</button>
          <button class="danger" data-student-delete="${s.id}">Delete</button>
        </div>
      </li>
    `
    )
    .join("");
}

function renderContents() {
  if (!state.contents.length) {
    el.contentList.innerHTML = "<li>No content available.</li>";
    return;
  }

  el.contentList.innerHTML = state.contents
    .map(
      (c) => `
      <li>
        <strong>${escapeHTML(c.title)}</strong> — ${escapeHTML(c.batchCode)} — ${escapeHTML(c.type)}
        <div class="actions">
          <button data-content-edit="${c.id}">Edit</button>
          <button class="danger" data-content-delete="${c.id}">Delete</button>
        </div>
      </li>
    `
    )
    .join("");
}

function renderAdmin() {
  renderBatchOptions();
  renderStudents();
  renderContents();
}

function markdownToHTML(md) {
  return escapeHTML(md)
    .replace(/^### (.*)$/gm, "<h4>$1</h4>")
    .replace(/^## (.*)$/gm, "<h3>$1</h3>")
    .replace(/^# (.*)$/gm, "<h2>$1</h2>")
    .replace(/^\- (.*)$/gm, "<li>$1</li>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    alert("Text-to-Speech is not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function renderStudentContent() {
  const batch = state.currentUser.batchCode;
  const items = state.contents.filter((c) => c.batchCode === batch);
  if (!items.length) {
    el.studentContent.innerHTML = "<p>No content assigned to this batch.</p>";
    return;
  }

  el.studentContent.innerHTML = items
    .map((item) => {
      let body = "";
      if (item.type === "video") body = `<iframe src="${escapeAttr(item.source)}" allowfullscreen></iframe>`;
      if (item.type === "audio") body = `<audio controls src="${escapeAttr(item.source)}"></audio>`;
      if (item.type === "pdf") body = `<iframe src="${escapeAttr(item.source)}"></iframe>`;
      if (item.type === "document") body = `<iframe src="${escapeAttr(item.source)}"></iframe>`;
      if (item.type === "markdown") body = `<div>${markdownToHTML(item.text || "")}</div>`;
      if (item.type === "text")
        body = `<p>${escapeHTML(item.text || "")}</p><button data-speak="${item.id}">Read Aloud (TTS)</button>`;

      return `
        <article class="content-item">
          <h4>${escapeHTML(item.title)}</h4>
          ${body}
        </article>
      `;
    })
    .join("");
}

function renderQuiz() {
  el.quizContainer.innerHTML = state.quiz
    .map(
      (q, idx) => `
      <fieldset>
        <legend>${idx + 1}. ${escapeHTML(q.question)}</legend>
        ${q.options
          .map(
            (opt) => `
            <label>
              <input type="radio" name="${q.id}" value="${escapeAttr(opt)}" />
              ${escapeHTML(opt)}
            </label>
          `
          )
          .join("")}
      </fieldset>
    `
    )
    .join("");
}

function renderFlashcards() {
  el.flashcards.innerHTML = state.flashcards
    .map(
      (card, i) => `
      <button class="flashcard" data-flash="${i}" data-show="front">
        <strong>${escapeHTML(card.front)}</strong>
      </button>
    `
    )
    .join("");
}

function renderMatching() {
  el.matching.innerHTML = state.matching
    .map(
      (pair, i) => `
      <div class="match-row">
        <div>${escapeHTML(pair.left)}</div>
        <select data-match-index="${i}">
          <option value="">Select</option>
          ${state.matching
            .map((choice) => `<option value="${escapeAttr(choice.right)}">${escapeHTML(choice.right)}</option>`)
            .join("")}
        </select>
      </div>
    `
    )
    .join("");
}

function renderStudentDashboard() {
  el.studentProfile.innerHTML = `
    <h3>Welcome, ${escapeHTML(state.currentUser.name)}</h3>
    <p><strong>Batch:</strong> ${escapeHTML(state.currentUser.batchCode)}</p>
    <p>Programs: Plan A ₹1000/month | Plan B ₹1500/month</p>
  `;
  renderStudentContent();
  renderQuiz();
  renderFlashcards();
  renderMatching();
}

function showAdmin() {
  el.authSection.classList.add("hidden");
  el.studentSection.classList.add("hidden");
  el.adminSection.classList.remove("hidden");
  renderAdmin();
}

function showStudent() {
  el.authSection.classList.add("hidden");
  el.adminSection.classList.add("hidden");
  el.studentSection.classList.remove("hidden");
  renderStudentDashboard();
}

function resetAuthView() {
  state.currentUser = null;
  el.authSection.classList.remove("hidden");
  el.adminSection.classList.add("hidden");
  el.studentSection.classList.add("hidden");
  setMessage(el.authMessage, "");
  setMessage(el.taskMessage, "");
  setMessage(el.quizResult, "");
  setMessage(el.matchingResult, "");
}

function clearStudentForm() {
  el.studentEditId.value = "";
  el.studentManageName.value = "";
  el.studentManageBatch.value = VALID_BATCH_CODES[0];
}

function clearContentForm() {
  el.contentEditId.value = "";
  el.contentTitle.value = "";
  el.contentBatch.value = VALID_BATCH_CODES[0];
  el.contentType.value = "video";
  el.contentSource.value = "";
  el.contentText.value = "";
}

function escapeHTML(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str = "") {
  return escapeHTML(str);
}

el.adminTab.addEventListener("click", () => switchAuthTab("admin"));
el.studentTab.addEventListener("click", () => switchAuthTab("student"));

el.adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("admin-username").value.trim();
  const password = document.getElementById("admin-password").value;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    state.currentUser = { role: "admin", name: "Administrator" };
    showAdmin();
    return;
  }
  setMessage(el.authMessage, "Invalid admin credentials.", "error");
});

el.studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("student-name").value.trim();
  const batchCode = document.getElementById("student-batch-code").value.trim().toUpperCase();

  if (!name) {
    setMessage(el.authMessage, "Student name is required.", "error");
    return;
  }
  if (!VALID_BATCH_CODES.includes(batchCode)) {
    setMessage(el.authMessage, "Invalid batch code.", "error");
    return;
  }

  state.currentUser = { role: "student", name, batchCode };
  showStudent();
});

el.adminLogout.addEventListener("click", resetAuthView);
el.studentLogout.addEventListener("click", resetAuthView);

el.studentManageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = el.studentEditId.value;
  const name = el.studentManageName.value.trim();
  const batchCode = el.studentManageBatch.value;
  if (!name) return;

  if (id) {
    const student = state.students.find((s) => s.id === id);
    if (student) {
      student.name = name;
      student.batchCode = batchCode;
    }
  } else {
    state.students.push({ id: `s${Date.now()}`, name, batchCode });
  }
  clearStudentForm();
  renderStudents();
});

el.studentsList.addEventListener("click", (e) => {
  const editId = e.target.getAttribute("data-student-edit");
  const deleteId = e.target.getAttribute("data-student-delete");

  if (editId) {
    const student = state.students.find((s) => s.id === editId);
    if (!student) return;
    el.studentEditId.value = student.id;
    el.studentManageName.value = student.name;
    el.studentManageBatch.value = student.batchCode;
  }

  if (deleteId) {
    state.students = state.students.filter((s) => s.id !== deleteId);
    renderStudents();
  }
});

el.studentFormReset.addEventListener("click", clearStudentForm);

el.contentManageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = el.contentEditId.value;
  const title = el.contentTitle.value.trim();
  const batchCode = el.contentBatch.value;
  const type = el.contentType.value;
  const source = el.contentSource.value.trim();
  const text = el.contentText.value.trim();

  if (!title) return;
  if (["video", "audio", "pdf", "document"].includes(type) && !source) return;
  if (["markdown", "text"].includes(type) && !text) return;

  if (id) {
    const content = state.contents.find((c) => c.id === id);
    if (content) {
      content.title = title;
      content.batchCode = batchCode;
      content.type = type;
      content.source = source;
      content.text = text;
    }
  } else {
    state.contents.push({
      id: `c${Date.now()}`,
      title,
      batchCode,
      type,
      source,
      text,
    });
  }

  clearContentForm();
  renderContents();
});

el.contentList.addEventListener("click", (e) => {
  const editId = e.target.getAttribute("data-content-edit");
  const deleteId = e.target.getAttribute("data-content-delete");

  if (editId) {
    const content = state.contents.find((c) => c.id === editId);
    if (!content) return;
    el.contentEditId.value = content.id;
    el.contentTitle.value = content.title;
    el.contentBatch.value = content.batchCode;
    el.contentType.value = content.type;
    el.contentSource.value = content.source;
    el.contentText.value = content.text;
  }

  if (deleteId) {
    state.contents = state.contents.filter((c) => c.id !== deleteId);
    renderContents();
  }
});

el.contentFormReset.addEventListener("click", clearContentForm);

el.studentContent.addEventListener("click", (e) => {
  const id = e.target.getAttribute("data-speak");
  if (!id) return;
  const content = state.contents.find((c) => c.id === id);
  if (content && content.text) {
    speakText(content.text);
  }
});

el.submitTask.addEventListener("click", () => {
  const response = el.taskResponse.value.trim();
  if (!response) {
    setMessage(el.taskMessage, "Please enter your task response before submission.", "error");
    return;
  }
  setMessage(el.taskMessage, "Task submitted successfully (demo mode, no backend).", "ok");
});

el.submitQuiz.addEventListener("click", () => {
  let score = 0;
  state.quiz.forEach((q) => {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);
    if (selected && selected.value === q.answer) score += 1;
  });
  setMessage(el.quizResult, `Your score: ${score}/${state.quiz.length}`, "ok");
});

el.flashcards.addEventListener("click", (e) => {
  const index = e.target.closest("[data-flash]")?.getAttribute("data-flash");
  if (index === undefined) return;
  const card = state.flashcards[Number(index)];
  const button = e.target.closest("[data-flash]");
  if (!card || !button) return;
  const showingFront = button.getAttribute("data-show") === "front";
  button.innerHTML = showingFront
    ? `<strong>${escapeHTML(card.back)}</strong>`
    : `<strong>${escapeHTML(card.front)}</strong>`;
  button.setAttribute("data-show", showingFront ? "back" : "front");
});

el.checkMatching.addEventListener("click", () => {
  const selects = el.matching.querySelectorAll("select[data-match-index]");
  let score = 0;
  selects.forEach((select) => {
    const idx = Number(select.getAttribute("data-match-index"));
    if (select.value && select.value === state.matching[idx].right) score += 1;
  });
  setMessage(el.matchingResult, `Matching score: ${score}/${state.matching.length}`, "ok");
});

renderBatchOptions();
clearStudentForm();
clearContentForm();
