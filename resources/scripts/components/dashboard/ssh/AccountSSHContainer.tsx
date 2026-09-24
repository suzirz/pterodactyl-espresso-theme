import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import ContentBox from '@/components/elements/ContentBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import FlashMessageRender from '@/components/FlashMessageRender';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { useSSHKeys } from '@/api/account/ssh-keys';
import { useFlashKey } from '@/plugins/useFlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faKey } from '@fortawesome/free-solid-svg-icons';

import CreateSSHKeyForm from '@/components/dashboard/ssh/CreateSSHKeyForm';
import DeleteSSHKeyButton from '@/components/dashboard/ssh/DeleteSSHKeyButton';

const HeaderBanner = styled.div`
    background: #1c1917;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 28px;
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

const SplitGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 1024px) {
        grid-template-columns: 380px minmax(0, 1fr);
    }
`;

const KeyRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: #25211e;
    border: 1px solid rgba(139, 120, 109, 0.25);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 12px;
    transition: all 0.15s ease;

    &:hover {
        border-color: rgba(191, 168, 158, 0.45);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const KeyInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
`;

const KeyIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #BFA89E;
    font-size: 16px;
    flex-shrink: 0;
`;

const KeyMeta = styled.div`
    min-width: 0;
    flex: 1;
`;

const KeyName = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px;
    font-weight: 600;
    color: #EBF5EE;
    margin: 0 0 2px 0;
`;

const FingerprintPill = styled.span`
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: #BFA89E;
    background: #1c1917;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(139, 120, 109, 0.25);
`;

const DateText = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    color: #8B786D;
    margin-left: 8px;
`;

const EmptyNotice = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #8B786D;
    text-align: center;
    margin: 32px 0;
`;


const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Recently';
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return 'Recently';
    }
};

export default () => {
    const { clearAndAddHttpError } = useFlashKey('account');
    const { data, isValidating, error } = useSSHKeys({
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    const isDemo = (window as any).PterodactylUser?.username === 'demo' || (window as any).PterodactylUser?.email === 'demo@bytenodes.id';
    const keys = data || [];

    return (
        <PageContentBlock title={'SSH Keys'}>
            <HeaderBanner>
                <HeaderInfo>
                    <IconBadge>
                        <FontAwesomeIcon icon={faTerminal} />
                    </IconBadge>
                    <div>
                        <Title>SSH Key Management</Title>
                        <Subtitle>Authenticate to server SFTP gateways and automated tools without typing account passwords.</Subtitle>
                    </div>
                </HeaderInfo>
                <LimitPill>
                    <span style={{ color: '#BFA89E' }}>{keys.length}</span> Registered Keys
                </LimitPill>
            </HeaderBanner>

            <FlashMessageRender byKey={'account'} style={{ marginBottom: '16px' }} />

            <SplitGrid>
                <ContentBox title={'Add SSH Key'}>
                    {isDemo ? (
                        <div style={{ textAlign: 'center', padding: '36px 16px', color: '#8B786D' }}>
                            <p style={{ margin: 0, fontWeight: 600, color: '#EBF5EE', fontSize: '15px' }}>SSH Key Registration Locked</p>
                            <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>Demo accounts cannot add new SSH credentials.</p>
                        </div>
                    ) : (
                        <CreateSSHKeyForm />
                    )}
                </ContentBox>

                <ContentBox title={'SSH Keys'}>
                    <SpinnerOverlay visible={isValidating} />
                    {keys.length === 0 ? (
                        <EmptyNotice>No public SSH keys registered on this account.</EmptyNotice>
                    ) : (
                        keys.map((key) => (
                            <KeyRow key={key.fingerprint}>
                                <KeyInfo>
                                    <KeyIcon>
                                        <FontAwesomeIcon icon={faKey} />
                                    </KeyIcon>
                                    <KeyMeta>
                                        <KeyName>{key.name}</KeyName>
                                        <div>
                                            <FingerprintPill title={key.fingerprint}>{key.fingerprint.substring(0, 24)}...</FingerprintPill>
                                            <DateText>
                                                Added {key.createdAt ? formatDate(key.createdAt) : 'Recently'}
                                            </DateText>
                                        </div>
                                    </KeyMeta>
                                </KeyInfo>
                                <DeleteSSHKeyButton name={key.name} fingerprint={key.fingerprint} />
                            </KeyRow>
                        ))
                    )}
                </ContentBox>
            </SplitGrid>
        </PageContentBlock>
    );
};
