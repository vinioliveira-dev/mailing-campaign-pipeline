import { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { DEFAULT_PIPELINE_STAGES } from '../types/pitch';
import { addCustomStage } from '../store/stagesSlice';
import { PipelineBoard } from '../components/PipelineBoard';
import styles from './CampaignsPage.module.css';

export function CampaignsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const campaignIdFromUrl = searchParams.get('campaign') ?? '';

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedPitchIds, setSelectedPitchIds] = useState<Set<string>>(new Set());

  const dispatch = useDispatch();
  const allPitches = useSelector((state: RootState) => state.pitches.items);
  const customStages = useSelector((state: RootState) => state.stages.customStages);

  const allStages = useMemo(
    () => [...DEFAULT_PIPELINE_STAGES, ...customStages],
    [customStages]
  );

  const filteredPitches = useMemo(() => {
    let result = allPitches;

    if (campaignIdFromUrl) {
      result = result.filter((p) => p.campaignId === campaignIdFromUrl);
    }

    const q = searchText.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.journalistName.toLowerCase().includes(q) ||
          p.outlet.toLowerCase().includes(q) ||
          (p.summary?.toLowerCase().includes(q) ?? false)
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter((p) => statusFilter.includes(p.stage));
    }

    return result;
  }, [allPitches, campaignIdFromUrl, searchText, statusFilter]);

  const toggleStatus = useCallback((stageId: string) => {
    setStatusFilter((prev) =>
      prev.includes(stageId)
        ? prev.filter((s) => s !== stageId)
        : [...prev, stageId]
    );
  }, []);

  const togglePitchSelect = useCallback((id: string) => {
    setSelectedPitchIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPitchIds(new Set());
  }, []);

  const clearCampaignFilter = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('campaign');
      return next;
    });
  }, [setSearchParams]);

  const handleAddStage = useCallback(() => {
    const name = window.prompt('Name for the new status column');
    const label = name?.trim();
    if (label) {
      dispatch(
        addCustomStage({
          id: `custom-${Date.now()}`,
          label,
        })
      );
    }
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <input
            type="search"
            placeholder="Search by title, journalist, outlet…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
            aria-label="Search pitches"
          />
          <div className={styles.statusFilters} role="group" aria-label="Filter by status">
            {allStages.map(({ id, label }) => (
              <label key={id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={statusFilter.includes(id)}
                  onChange={() => toggleStatus(id)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        {campaignIdFromUrl && (
          <button type="button" onClick={clearCampaignFilter} className={styles.clearCampaign}>
            Clear campaign filter
          </button>
        )}
      </div>
      <PipelineBoard
        pitchesOverride={
          campaignIdFromUrl || searchText.trim() || statusFilter.length > 0
            ? filteredPitches
            : undefined
        }
        selectedPitchIds={selectedPitchIds}
        onTogglePitchSelect={togglePitchSelect}
        onClearSelection={clearSelection}
        onAddStage={handleAddStage}
      />
    </div>
  );
}
