// Render , Thêm , Xóa , Sửa
var courseApi = 'http://localhost:3000/courses';

function start() {
    getCourse(renderCourse);
    handleCreateForm();
}
start();

function getCourse(course) {
    fetch(courseApi)
    .then(function(response) {
        return response.json();
    })
    .then(course);
}

function renderCourse(courses) {
    var listCourse = document.querySelector('#list-course');
    var htmls = courses.map(function(course) {
        return `
            <li class="course-item-${course.id}">
                <h4 class="course-name-${course.id}">${course.name}</h4>
                <p class="course-desc-${course.id}">${course.description}</p>
                <button onclick="handleDeleteCourse(${course.id})">XOA</button>
                <button onclick="handleUpdateCourse(${course.id})">SUA</button>
            </li>
        `;
    });
    listCourse.innerHTML = htmls.join('');
}

function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };
    fetch(courseApi, options)
    .then(function(response) {
        return response.json();
    })
    .then(callback);
}

function updateCourse(id, data,callback) {
    var options = {
        method: 'PUT',
        headers: {   
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };
    fetch(courseApi + '/' + id, options)
    .then(function(response) {
        return response.json();
    })
    .then(callback)
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create');
    createBtn.onclick =   function() {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var formData = {
            name: name,
            description: description
        };
        createCourse(formData, function() {
            getCourse(renderCourse);
        });
    };
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    };
    fetch(courseApi + '/' + id, options)
    .then(function(response) {
        return response.json();
    })
    .then(function() {
        var courseItem = document.querySelector('.course-item-' + id);
        if (courseItem) {
            courseItem.remove();
        }
    });
}

function handleUpdateCourse(id) {
    var createBtn = document.querySelector('#create');
    createBtn.innerText = 'UPDATE';

    // lấy thông tin khóa học từ phần tử hiện tại
    var nameInput = document.querySelector('input[name="name"]');
    var descriptionInput = document.querySelector('input[name="description"]');

    var courseName = document.querySelector('.course-name-' + id);
    var descName = document.querySelector('.course-desc-' + id);

    // Hiển thị thông tin tên mô tả khóa học trong ô input
    nameInput.value = courseName.innerText;
    descriptionInput.value = descName.innerText;

    createBtn.onclick = function() {
        var name = nameInput.value;
        var description = descriptionInput.value;
        var formData = {
            name: name,
            description: description
        }
        updateCourse(id, formData,function() {
            getCourse(renderCourse)
            nameInput.value = "";
            descriptionInput.value = "";
            createBtn.innerText = "Create";
            handleCreateForm();
        });
    
    };
}