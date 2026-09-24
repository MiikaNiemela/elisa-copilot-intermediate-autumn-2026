import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Heatmap } from '../src/components/Heatmap.js';
import type { HeatmapData } from '@tsm/shared';

const { setAssessment } = vi.hoisted(() => ({
  setAssessment: vi.fn(),
}));

vi.mock('../src/api/client.js', () => ({
  api: { setAssessment },
}));

const data: HeatmapData = {
  teamId: 'team-1',
  engineers: [
    { id: 'eng-1', name: 'Ada', role: 'Engineer', teamId: 'team-1' },
    { id: 'eng-2', name: 'Linus', role: 'Engineer', teamId: 'team-1' },
  ],
  skills: [
    { id: 'skill-1', name: 'TypeScript', category: 'Languages', targetLevel: 3 },
    { id: 'skill-2', name: 'Testing', category: 'Practices', targetLevel: 2 },
  ],
  cells: [
    { engineerId: 'eng-1', skillId: 'skill-1', level: 1, belowTarget: true },
    { engineerId: 'eng-1', skillId: 'skill-2', level: 4, belowTarget: false },
    { engineerId: 'eng-2', skillId: 'skill-1', level: 3, belowTarget: false },
    { engineerId: 'eng-2', skillId: 'skill-2', level: 0, belowTarget: true },
  ],
};

function renderHeatmap(queryClient = new QueryClient()) {
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <Heatmap data={data} />
      </QueryClientProvider>,
    ),
  };
}

describe('Heatmap', () => {
  it('renders engineer and skill headers with accessible level cells', () => {
    renderHeatmap();

    expect(screen.getByRole('grid', { name: 'Team skill heatmap' })).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByTestId('cell-eng-1-skill-1')).toHaveAccessibleName(
      'Ada \u2014 TypeScript: level 1, below target',
    );
    expect(screen.getByTestId('cell-eng-2-skill-1')).toHaveTextContent('3');
  });

  it('advances the level and invalidates affected queries', async () => {
    setAssessment.mockResolvedValue({});
    const queryClient = new QueryClient();
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const user = userEvent.setup();
    renderHeatmap(queryClient);

    await user.click(screen.getByTestId('cell-eng-1-skill-1'));

    await waitFor(() => {
      expect(setAssessment).toHaveBeenCalledWith('eng-1', 'skill-1', 2);
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['heatmap', 'team-1'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['gaps', 'team-1'] });
      expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['assessments'] });
    });
  });

  it('wraps level four to zero', async () => {
    setAssessment.mockResolvedValue({});
    const user = userEvent.setup();
    renderHeatmap();

    await user.click(screen.getByTestId('cell-eng-1-skill-2'));

    await waitFor(() => {
      expect(setAssessment).toHaveBeenCalledWith('eng-1', 'skill-2', 0);
    });
  });
});
