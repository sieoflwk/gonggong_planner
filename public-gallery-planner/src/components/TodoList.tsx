import React, { useState } from 'react';
import { type Todo } from '../types';
import { Card, EmptyState } from './shared/Card';
import { PlusIcon, TrashIcon, CheckCircleIcon } from './shared/icons';

interface TodoListProps {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, setTodos, showToast }) => {
    const [newTodoText, setNewTodoText] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedText = newTodoText.trim();
        if (!trimmedText) return;

        const newTodo: Todo = {
            id: Date.now().toString(),
            text: trimmedText,
            completed: false
        };
        setTodos(prev => [...prev, newTodo]);
        setNewTodoText('');
    };

    const handleToggleTodo = (id: string) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                if (!todo.completed) {
                    showToast('할 일 완료!', 'success');
                }
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        }));
    };

    const handleDeleteTodo = (id: string) => {
        setDeletingId(id);
        setTimeout(() => {
            setTodos(prev => prev.filter(todo => todo.id !== id));
            showToast('할 일이 삭제되었습니다.', 'success');
            setDeletingId(null);
        }, 300);
    };

    return (
        <Card title="오늘의 할 일" icon={<CheckCircleIcon className="w-6 h-6" />} className="animate-card-pop-in" style={{ animationDelay: '100ms', opacity: 0 }}>
            <form onSubmit={handleAddTodo} className="flex gap-2">
                <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="예: 기출문제 1회 풀기"
                    className="flex-grow w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition"
                />
                <button type="submit" className="flex-shrink-0 bg-brand-primary-500 text-white font-bold p-2.5 rounded-lg hover:bg-brand-primary-600 transition-all transform hover:scale-105 disabled:opacity-50" disabled={!newTodoText.trim()}>
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>
            <div className="min-h-[100px]">
                {todos.length > 0 ? (
                    <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {todos.map((todo, index) => {
                            const isDeleting = deletingId === todo.id;
                            return (
                                <li 
                                    key={todo.id} 
                                    className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg group transition-all duration-300 ${isDeleting ? 'animate-list-item-exit overflow-hidden' : 'animate-slide-up-fade'}`}
                                    style={isDeleting ? {} : { animationDelay: `${index * 50}ms`, opacity: 0 }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`todo-${todo.id}`}
                                        checked={todo.completed}
                                        onChange={() => handleToggleTodo(todo.id)}
                                        className="w-5 h-5 rounded-md text-brand-primary-500 bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500 focus:ring-brand-primary-500 cursor-pointer"
                                    />
                                    <label htmlFor={`todo-${todo.id}`} className={`flex-grow cursor-pointer transition-colors ${todo.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {todo.text}
                                    </label>
                                    <button onClick={() => handleDeleteTodo(todo.id)} className="p-1.5 text-slate-500 hover:text-red-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity opacity-0 group-hover:opacity-100">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <EmptyState 
                        icon={<CheckCircleIcon className="w-8 h-8" />}
                        title="할 일 없음"
                        description="새로운 할 일을 추가하여 하루를 계획해보세요."
                    />
                )}
            </div>
        </Card>
    );
};
