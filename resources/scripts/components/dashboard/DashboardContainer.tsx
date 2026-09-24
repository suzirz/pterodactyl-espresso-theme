import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import { useLocation } from 'react-router-dom';
import Pagination from '@/components/elements/Pagination';
import { PaginatedResult } from '@/api/http';
import styled from 'styled-components/macro';
import useSWR from 'swr';
import QuickHubCards from '@/components/dashboard/QuickHubCards';
import DashboardActivityWidget from '@/components/dashboard/DashboardActivityWidget';
import AnnouncementNotification from '@/components/dashboard/AnnouncementNotification';

interface DashboardProps {
    searchQuery?: string;
}

const WelcomeSection = styled.div`
    margin-bottom: 20px;
`;

const GreetingTitle = styled.h1`
    font-family: 'Outfit', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #EBF5EE;
    margin: 0 0 6px 0;
    letter-spacing: -0.02em;
`;

const GreetingSubtitle = styled.p`
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: #8B786D;
    margin: 0;
`;

const MainGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 1280px) {
        grid-template-columns: minmax(0, 1fr) 310px;
    }

    @media (min-width: 1440px) {
        grid-template-columns: minmax(0, 1fr) 330px;
    }
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
    width: 100%;
    overflow: hidden;
`;

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
`;

const HeaderBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(139, 120, 109, 0.15);
    gap: 12px;
    flex-wrap: wrap;
`;

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const SectionTitle = styled.h2`
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #EBF5EE;
    margin: 0;
`;

const CountBadge = styled.span`
    font-family: 'Outfit', sans-serif;
    font-size: 11.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    background-color: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.25);
    color: #BFA89E;
`;

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    & p {
        font-family: 'Outfit', sans-serif;
        font-size: 11.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #8B786D;
        margin: 0;
    }
`;

const EmptyStateBox = styled.div`
    background-color: #1c1917;
    border: 1px solid rgba(191, 168, 158, 0.18);
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    color: #8B786D;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
`;

export default ({ searchQuery = '' }: DashboardProps) => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const user = useStoreState((state: any) => state.user.data);
    const uuid = user?.uuid;
    const rootAdmin = user?.rootAdmin;
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const totalCount = servers?.pagination.total || 0;
    const displayName = user?.nameFirst || user?.username || 'Commander';

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            <WelcomeSection>
                <GreetingTitle>Welcome back, {displayName}</GreetingTitle>
                <GreetingSubtitle>Manage all your instances here with live usage metrics.</GreetingSubtitle>
            </WelcomeSection>

            <AnnouncementNotification />

            <QuickHubCards />

            <MainGrid>
                <LeftColumn>
                    <HeaderBar>
                        <TitleWrapper>
                            <SectionTitle>Your servers</SectionTitle>
                            <CountBadge>
                                {totalCount} Servers
                            </CountBadge>
                        </TitleWrapper>
                        {rootAdmin && (
                            <ToggleContainer>
                                <p>{showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}</p>
                                <Switch
                                    name={'show_all_servers'}
                                    defaultChecked={showOnlyAdmin}
                                    onChange={() => setShowOnlyAdmin((s: boolean) => !s)}
                                />
                            </ToggleContainer>
                        )}
                    </HeaderBar>

                    {!servers ? (
                        <Spinner centered size={'large'} />
                    ) : (
                        <Pagination data={servers} onPageSelect={setPage}>
                            {({ items }) => {
                                const q = searchQuery.toLowerCase().trim();
                                const displayed = q
                                    ? items.filter(
                                          (s) =>
                                              s.name.toLowerCase().includes(q) ||
                                              s.node.toLowerCase().includes(q) ||
                                              (s.description && s.description.toLowerCase().includes(q)) ||
                                              s.uuid.toLowerCase().includes(q)
                                      )
                                    : items;

                                return displayed.length > 0 ? (
                                    <>
                                        {displayed.map((server, index) => (
                                            <ServerRow
                                                key={server.uuid}
                                                server={server}
                                                css={index > 0 ? 'margin-top: 12px;' : undefined}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <EmptyStateBox>
                                        {searchQuery
                                            ? `No servers match your search query "${searchQuery}".`
                                            : 'There are no servers associated with your account.'}
                                    </EmptyStateBox>
                                );
                            }}
                        </Pagination>
                    )}
                </LeftColumn>

                <RightColumn>
                    <DashboardActivityWidget />
                </RightColumn>
            </MainGrid>
        </PageContentBlock>
    );
};
