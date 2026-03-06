import { useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { PipelineStage } from '../types/pitch';
import { PIPELINE_STAGES } from '../types/pitch';
import { PipelineBoard } from '../components/PipelineBoard';
import styles from './CampaignsPage.module.css';

export function CampaignsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const campaignIdFromUrl = searchParams.get('campaign') ?? '';

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<PipelineStage[]>([]);

  const allPitches = useSelector((state: RootState) => state.pitches.items);

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

  const toggleStatus = useCallback((stage: PipelineStage) => {
    setStatusFilter((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  }, []);

  const clearCampaignFilter = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('campaign');
      return next;
    });
  }, [setSearchParams]);

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
            {PIPELINE_STAGES.map(({ id, label }) => (
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
      />
    </div>
  );
}
