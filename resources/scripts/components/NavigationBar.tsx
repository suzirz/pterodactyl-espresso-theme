import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const NavigationContainer = styled.header`
    width: 100%;
    background-color: #1c1917;
    border-bottom: 1px solid rgba(139, 120, 109, 0.2);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    position: sticky;
    top: 0;
    z-index: 40;
`;

const NavigationInner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    width: 100%;
    max-width: 1560px;
    margin: 0 auto;
    padding: 0 24px;
    box-sizing: border-box;
`;

const LogoSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    & a {
        font-family: 'Outfit', sans-serif;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.3px;
        color: #EBF5EE;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: color 0.15s ease;

        &:hover {
            color: #BFA89E;
        }
    }
`;

const BrandBadge = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: linear-gradient(135deg, #25211e 0%, #1c1917 100%);
    border: 1px solid rgba(191, 168, 158, 0.3);
    color: #BFA89E;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const RightNavigation = styled.nav`
    display: flex;
    align-items: center;
    height: 100%;
    gap: 4px;

    & > a,
    & > button,
    & > .navigation-link,
    & a,
    & button,
    & .navigation-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 38px;
        min-width: 38px;
        padding: 0 12px;
        color: #8B786D;
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
            color: #EBF5EE;
            background-color: rgba(191, 168, 158, 0.08);
            border-color: rgba(191, 168, 158, 0.15);
        }

        &:active,
        &.active {
            color: #EBF5EE;
            background-color: #25211e;
            border-color: rgba(191, 168, 158, 0.4);
            box-shadow: inset 0 -2px #BFA89E;
        }
    }

    & > button {
        outline: none;
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <NavigationContainer>
            <SpinnerOverlay visible={isLoggingOut} />
            <NavigationInner>
                <LogoSection id={'logo'}>
                    <Link to={'/'}>
                        <BrandBadge>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </BrandBadge>
                        <span>{name}</span>
                    </Link>
                </LogoSection>
                <RightNavigation>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span style={{ display: 'flex', alignItems: 'center', width: '22px', height: '22px' }}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </NavigationInner>
        </NavigationContainer>
    );
};
