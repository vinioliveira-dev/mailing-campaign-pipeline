import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setMailings, setSelectedMailingId } from '../store/mailingsSlice';
import { mockApi } from '../api/mockApi';
import type { Mailing } from '../types/mailing';
import styles from './MailingsPage.module.css';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function MailingListItem({
  mailing,
  isSelected,
  onSelect,
}: {
  mailing: Mailing;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.mailingItem} ${isSelected ? styles.mailingItemSelected : ''}`}
      onClick={onSelect}
    >
      <span className={styles.mailingSubject}>{mailing.subject}</span>
      <span className={styles.mailingMeta}>
        {formatDate(mailing.createdAt)} · {mailing.status}
      </span>
    </button>
  );
}

function MailingDetail({ mailing }: { mailing: Mailing }) {
  const navigate = useNavigate();

  const handleSeeCampaign = () => {
    navigate(`/campaigns?campaign=${encodeURIComponent(mailing.campaignId)}`);
  };

  return (
    <div className={styles.detail}>
      <h2 className={styles.detailTitle}>{mailing.subject}</h2>
      <dl className={styles.detailList}>
        <dt>Status</dt>
        <dd>
          <span className={styles[`status${mailing.status.charAt(0).toUpperCase() + mailing.status.slice(1)}`]}>
            {mailing.status}
          </span>
        </dd>
        <dt>Created</dt>
        <dd>{formatDate(mailing.createdAt)}</dd>
        <dt>Last updated</dt>
        <dd>{formatDate(mailing.updatedAt)}</dd>
        <dt>Recipients</dt>
        <dd>{mailing.recipientCount}</dd>
        {mailing.sentAt && (
          <>
            <dt>Sent at</dt>
            <dd>{formatDate(mailing.sentAt)}</dd>
          </>
        )}
        {mailing.scheduledFor && (
          <>
            <dt>Scheduled for</dt>
            <dd>{formatDate(mailing.scheduledFor)}</dd>
          </>
        )}
      </dl>
      <div className={styles.detailActions}>
        <button type="button" onClick={handleSeeCampaign} className={styles.seeCampaignBtn}>
          See campaign
        </button>
      </div>
    </div>
  );
}

export function MailingsPage() {
  const dispatch = useDispatch();
  const { items: mailings, selectedId } = useSelector((state: RootState) => state.mailings);

  useEffect(() => {
    mockApi.fetchMailings().then((data) => {
      dispatch(setMailings(data));
    });
  }, [dispatch]);

  const selectedMailing = mailings.find((m) => m.id === selectedId);

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Mailings</h2>
        <div className={styles.mailingList}>
          {mailings.map((m) => (
            <MailingListItem
              key={m.id}
              mailing={m}
              isSelected={m.id === selectedId}
              onSelect={() => dispatch(setSelectedMailingId(m.id))}
            />
          ))}
        </div>
      </aside>
      <section className={styles.main}>
        {selectedMailing ? (
          <MailingDetail mailing={selectedMailing} />
        ) : (
          <div className={styles.empty}>Select a mailing to view details.</div>
        )}
      </section>
    </div>
  );
}
