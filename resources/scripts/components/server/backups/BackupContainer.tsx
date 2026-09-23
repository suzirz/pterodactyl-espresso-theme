import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Spinner from '@/components/elements/Spinner';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import CreateBackupButton from '@/components/server/backups/CreateBackupButton';
import FlashMessageRender from '@/components/FlashMessageRender';
import BackupRow from '@/components/server/backups/BackupRow';
import tw from 'twin.macro';
import getServerBackups, { Context as ServerBackupContext } from '@/api/swr/getServerBackups';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Pagination from '@/components/elements/Pagination';

const HeaderBanner = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const HeaderInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const IconBadge = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #25211e;
    border: 1px solid rgba(191, 168, 158, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 18px;
    flex-shrink: 0;
`;

const Title = styled.h2`
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0 0 4px 0;
`;

const Subtitle = styled.p`
    font-size: 13px;
    color: #8B786D;
    margin: 0;
`;

const ActionsArea = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const LimitPill = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #EBF5EE;
`;

const EmptyCard = styled.div`
    background: #1c1917;
    border: 1px dashed rgba(139, 120, 109, 0.3);
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
`;

const EmptyIconBox = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8B786D;
    font-size: 22px;
    margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #EBF5EE;
    margin: 0 0 6px 0;
`;

const EmptyText = styled.p`
    font-size: 13px;
    color: #8B786D;
    max-width: 440px;
    line-height: 1.5;
    margin: 0;
`;

const BackupListGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const BackupContainer = () => {
    const { page, setPage } = useContext(ServerBackupContext);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { data: backups, error, isValidating } = getServerBackups();

    const backupLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.backups);

    useEffect(() => {
        if (!error) {
            clearFlashes('backups');
            return;
        }

        clearAndAddHttpError({ error, key: 'backups' });
    }, [error]);

    if (!backups || (error && isValidating)) {
        return <Spinner size={'large'} centered />;
    }

    const canCreate = backupLimit > 0 && backupLimit > backups.backupCount;

    return (
        <ServerContentBlock title={'Backups'}>
            <FlashMessageRender byKey={'backups'} css={tw`mb-4`} />
            
            <HeaderBanner>
                <HeaderInfo>
                    <IconBadge>
                        <FontAwesomeIcon icon={faArchive} />
                    </IconBadge>
                    <div>
                        <Title>Backups</Title>
                        <Subtitle>Create, lock, download, and restore point-in-time snapshots of this server.</Subtitle>
                    </div>
                </HeaderInfo>
                <ActionsArea>
                    {backupLimit > 0 && (
                        <LimitPill>
                            <span style={{ color: '#BFA89E' }}>{backups.backupCount}</span> / {backupLimit} Stored
                        </LimitPill>
                    )}
                    {backupLimit === 0 && (
                        <LimitPill style={{ color: '#8B786D' }}>
                            Backups Disabled (Limit 0)
                        </LimitPill>
                    )}
                    <Can action={'backup.create'}>
                        {canCreate && <CreateBackupButton />}
                    </Can>
                </ActionsArea>
            </HeaderBanner>

            <Pagination data={backups} onPageSelect={setPage}>
                {({ items }) =>
                    !items.length ? (
                        <EmptyCard>
                            <EmptyIconBox>
                                <FontAwesomeIcon icon={faArchive} />
                            </EmptyIconBox>
                            <EmptyTitle>No Backups Found</EmptyTitle>
                            <EmptyText>
                                {backupLimit > 0
                                    ? page > 1
                                        ? "Looks like we've run out of backups to show you, try returning to the previous page."
                                        : 'No backup archives are currently stored for this server. Use "+ Create Backup" to create a snapshot.'
                                    : 'Backup creation is disabled on this server instance. Contact support to increase your backup limit.'}
                            </EmptyText>
                        </EmptyCard>
                    ) : (
                        <BackupListGrid>
                            {items.map((backup) => (
                                <BackupRow key={backup.uuid} backup={backup} />
                            ))}
                        </BackupListGrid>
                    )
                }
            </Pagination>
        </ServerContentBlock>
    );
};

export default () => {
    const [page, setPage] = useState<number>(1);
    return (
        <ServerBackupContext.Provider value={{ page, setPage }}>
            <BackupContainer />
        </ServerBackupContext.Provider>
    );
};
