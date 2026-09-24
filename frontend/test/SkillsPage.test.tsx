import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkillsPage } from '../src/routes/SkillsPage.js';
import type { Skill } from '@tsm/shared';

const { listSkills, createSkill, updateSkill, deleteSkill } = vi.hoisted(() => ({
  listSkills: vi.fn(),
  createSkill: vi.fn(),
  updateSkill: vi.fn(),
  deleteSkill: vi.fn(),
}));

vi.mock('../src/api/client.js', () => ({
  api: { listSkills, createSkill, updateSkill, deleteSkill },
}));

const skills: Skill[] = [
  { id: 'skill-1', name: 'TypeScript', category: 'Languages', description: 'Type-safe JS', targetLevel: 3 },
  { id: 'skill-2', name: 'Testing', category: 'Practices', description: undefined, targetLevel: 2 },
  { id: 'skill-3', name: 'Docker', category: 'DevOps', description: 'Container tech', targetLevel: 2 },
];

function renderSkillsPage() {
  const qc = new QueryClient();
  return {
    queryClient: qc,
    ...render(
      <QueryClientProvider client={qc}>
        <SkillsPage />
      </QueryClientProvider>,
    ),
  };
}

describe('SkillsPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title, subtitle, and form section', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Skills Inventory' })).toBeInTheDocument();
    expect(screen.getByText('All tracked skills, their categories, and the team-wide target proficiency.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Add skill' })).toBeInTheDocument();
  });

  it('fetches and displays all skills in the table', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    await waitFor(() => {
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Docker')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    expect(screen.getByText('Type-safe JS')).toBeInTheDocument();
    expect(screen.getByText('Container tech')).toBeInTheDocument();
    expect(screen.getByText('3 of 3')).toBeInTheDocument();
  });

  it('allows form input for new skill creation', async () => {
    listSkills.mockResolvedValue([]);
    const user = userEvent.setup();
    renderSkillsPage();

    const nameInput = screen.getByPlaceholderText('Name');
    const categoryInput = screen.getByPlaceholderText('Category');
    const descInput = screen.getByPlaceholderText('Description (optional)');

    await user.type(nameInput, 'Rust');
    await user.type(categoryInput, 'Languages');
    await user.type(descInput, 'Systems lang');

    expect(nameInput).toHaveValue('Rust');
    expect(categoryInput).toHaveValue('Languages');
    expect(descInput).toHaveValue('Systems lang');
  });

  it('filters skills by name', async () => {
    listSkills.mockResolvedValue(skills);
    const user = userEvent.setup();
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    const filterInput = screen.getByPlaceholderText('Filter by name or category…');
    await user.type(filterInput, 'Docker');

    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
  });

  it('filters skills by category', async () => {
    listSkills.mockResolvedValue(skills);
    const user = userEvent.setup();
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    const filterInput = screen.getByPlaceholderText('Filter by name or category…');
    await user.type(filterInput, 'Practices');

    expect(screen.getByText('Testing')).toBeInTheDocument();
    expect(screen.queryByText('Docker')).not.toBeInTheDocument();
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
  });

  it('clears filter to show all skills', async () => {
    listSkills.mockResolvedValue(skills);
    const user = userEvent.setup();
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    const filterInput = screen.getByPlaceholderText('Filter by name or category…') as HTMLInputElement;
    await user.type(filterInput, 'Docker');
    expect(screen.getByText('1 of 3')).toBeInTheDocument();

    await user.clear(filterInput);
    expect(screen.getByText('3 of 3')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('displays skill descriptions only when present', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    expect(screen.getByText('Type-safe JS')).toBeInTheDocument();
    expect(screen.getByText('Container tech')).toBeInTheDocument();
  });

  it('displays category badges for each skill', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Practices')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });

  it('renders target level select for each skill', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(1);
  });

  it('renders delete button for each skill', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    expect(deleteButtons).toHaveLength(3);
  });

  it('renders legend with all competency levels', async () => {
    listSkills.mockResolvedValue(skills);
    renderSkillsPage();

    await waitFor(() => expect(screen.getByText('TypeScript')).toBeInTheDocument());

    expect(screen.getByText('Level:')).toBeInTheDocument();
    for (let i = 0; i <= 4; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });
});
