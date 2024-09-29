import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TodoService } from './todo.service';

interface Todo {
  id: number;
  title: string;
}

@Component({
  selector: 'app-root',
  standalone: true, // Specify that this component is standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [FormsModule, CommonModule] // Add FormsModule to imports
})
export class AppComponent {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  editingTodoId: number | null = null;
  editTodoTitle: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (todos) => (this.todos = todos),
      error: (err) => console.error('Failed to load todos', err),
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: 0, // Placeholder ID, will be set by the backend
      title: this.newTodoTitle
    };

    this.todoService.addTodo(newTodo).subscribe({
      next: (todo) => {
        this.todos.push(todo);
        this.newTodoTitle = ''; // Clear input after adding
        this.loadTodos();
      },
      error: (err) => console.error('Failed to add todo', err),
    });
  }

  editTodo(todo: Todo) {
    this.editingTodoId = todo.id;
    this.editTodoTitle = todo.title; // Set the title to the current todo's title
  }

  updateTodo() {
    if (this.editingTodoId === null || !this.editTodoTitle.trim()) return;

    const updatedTodo: Todo = {
      id: this.editingTodoId,
      title: this.editTodoTitle
    };

    this.todoService.updateTodo(updatedTodo).subscribe({
      next: (todo) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = todo;
        }
        this.cancelEdit(); // Clear editing state
        this.loadTodos();
      },
      error: (err) => console.error('Failed to update todo', err),
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id); // Remove from the list
      },
      error: (err) => console.error('Failed to delete todo', err),
    });
  }

  cancelEdit() {
    this.editingTodoId = null;
    this.editTodoTitle = ''; // Reset the input field
  }
}
